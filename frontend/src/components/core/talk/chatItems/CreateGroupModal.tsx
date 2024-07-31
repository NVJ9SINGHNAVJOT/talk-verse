import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import { addChatBarData } from "@/redux/slices/chatSlice";
import { addNewUnseen } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { createGroupApi } from "@/services/operations/notificationApi";
import { maxFileSize, validFiles } from "@/utils/constants";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiCirclePlus, CiImageOn, CiCircleMinus } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type CreateGroupModalProps = {
  setIsCreateGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type CreateGroupData = {
  groupName: string;
};

const CreateGroupModal = (props: CreateGroupModalProps) => {
  const dispatch = useDispatch();
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const friends = useAppSelector((state) => state.chat.friends);
  const [creatingGroup, setCreatingGroup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const refModal = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(refModal, () => props.setIsCreateGroupOpen(false));

  const addMember = (_id: string) => {
    if (!groupMembers.includes(_id)) {
      setGroupMembers((prev) => [...prev, _id]);
    } else {
      setGroupMembers(() => groupMembers.filter((friendId) => friendId !== _id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxFileSize) {
        toast.info("Max 5mb image file allowed");
        return;
      }
      const fileType = file.type;
      if (validFiles.image.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
        setSelectedFile(null);
      }
    }
  };

  const { register, handleSubmit, reset } = useForm<CreateGroupData>();

  const createGroup = async (data: CreateGroupData) => {
    if (groupMembers.length < 2) {
      toast.info("Minimum 3 members required for group");
      return;
    }
    if (groupMembers.length > 50) {
      toast.info("Maximum 50 members are allowed for group");
      return;
    }

    setCreatingGroup(true);
    reset();

    const newFormData = new FormData();
    if (selectedFile) {
      newFormData.append("imageFile", selectedFile);
    }
    newFormData.append("groupName", data.groupName);
    newFormData.append("userIdsInGroup", JSON.stringify(groupMembers));

    const response = await createGroupApi(newFormData);
    if (response && response.success) {
      dispatch(addNewUnseen(response.newGroup._id));
      dispatch(addChatBarData(response.newGroup));
      toast.success("Group created");
    } else {
      toast.error("Error while creating group");
    }
    props.setIsCreateGroupOpen(false);
  };

  const handleimgTagRefClick = () => {
    fileInputRef.current?.click();
  };

  return creatingGroup === true ? (
    <WorkModal title="Creating Group" />
  ) : (
    <div
      className="fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center overflow-y-auto 
    bg-transparent backdrop-blur-[4px]"
    >
      <div ref={refModal} className="flex flex-col gap-6 p-8">
        <form onSubmit={handleSubmit(createGroup)} className="flex items-center justify-center gap-6 p-8">
          <div className="relative flex size-11 items-center justify-center">
            <input
              id="imgInput"
              name="imageInput"
              ref={fileInputRef}
              className="absolute hidden h-5 w-5"
              type="file"
              accept=".jpg ,.jpeg, .png"
              onChange={handleImageChange}
              placeholder=""
            />
            {selectedFile === null ? (
              <CiImageOn
                onClick={handleimgTagRefClick}
                className="absolute block size-11 cursor-pointer rounded bg-richblack-300"
              />
            ) : (
              <img
                src={URL.createObjectURL(selectedFile)}
                onClick={handleimgTagRefClick}
                className="absolute block size-11 cursor-pointer rounded bg-richblack-300 object-cover"
                alt="Avatar"
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Create Group"
            className="h-[3rem] w-[10rem] rounded-md border-2 border-transparent bg-black p-4 text-white 
            focus:border-[#8678F9] focus:outline-none"
            {...register("groupName", {
              required: true,
              pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/,
              minLength: 1,
              maxLength: 15,
            })}
          />
          <button
            disabled={creatingGroup}
            type="submit"
            className="relative inline-flex h-[3rem] w-fit items-center justify-center rounded-md bg-white 
            px-4 font-medium text-gray-950 transition-colors"
          >
            <div
              className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] 
            opacity-75 blur"
            />
            Create
          </button>
        </form>
        {/* friends */}
        <div
          className="flex max-h-[calc(100vh-50vh)] w-[35rem] max-w-[40rem] flex-wrap items-start justify-center 
        gap-7 overflow-y-scroll text-white"
        >
          {friends.map((friend, index) => {
            return (
              <div key={index} className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1 text-white">
                {friend.imageUrl ? (
                  <img src={friend.imageUrl} className="aspect-auto size-8 rounded-full" alt="Loading..." />
                ) : (
                  <RxAvatar className="aspect-auto size-8" />
                )}
                <div className="flex items-center justify-center gap-x-2 text-xs text-white">
                  <div>{friend.firstName}</div>
                  <div>{friend.lastName}</div>
                </div>
                {groupMembers.includes(friend._id) ? (
                  <CiCircleMinus
                    onClick={() => addMember(friend._id)}
                    className="aspect-auto size-6 cursor-pointer rounded-full bg-white text-black"
                  />
                ) : (
                  <CiCirclePlus
                    onClick={() => addMember(friend._id)}
                    className="aspect-auto size-6 cursor-pointer rounded-full text-white hover:bg-white hover:text-black"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
