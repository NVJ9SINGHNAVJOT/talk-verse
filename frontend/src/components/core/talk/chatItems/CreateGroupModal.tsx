import useOnClickOutside from "@/hooks/useOnClickOutside";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import { addChatBarData, addGroup } from "@/redux/slices/chatSlice";
import { setCreateGroupLoading } from "@/redux/slices/loadingSlice";
import { addNewUnseen } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { createGroupApi } from "@/services/operations/notificationApi";
import { maxFileSize, validFiles } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiCirclePlus, CiImageOn, CiCircleMinus } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type CreateGroupModalProps = {
  toggelCreateGroupModal: () => void;
};

type CreateGroupData = {
  groupName: string;
};

const CreateGroupModal = (props: CreateGroupModalProps) => {
  const dispatch = useDispatch();
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const friends = useAppSelector((state) => state.chat.friends);
  const creatingGroup = useAppSelector((state) => state.loading.createGroupLd);
  const { toggelCreateGroupModal } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const refModal = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(refModal, toggelCreateGroupModal);

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
    dispatch(setCreateGroupLoading(true));
    reset();
    const newFormData = new FormData();
    if (selectedFile) {
      newFormData.append("imageFile", selectedFile);
    }
    newFormData.append("groupName", data.groupName);
    newFormData.append("userIdsInGroup", JSON.stringify(groupMembers));
    setGroupMembers([]);

    const response = await createGroupApi(newFormData);
    if (response && response.success) {
      dispatch(addGroup(response.newGroup));
      dispatch(addNewUnseen(response.newGroup._id));
      dispatch(addChatBarData(response.newGroup));
      toast.success("Group created");
    } else {
      toast.error("Error while creating group");
    }
    toggelCreateGroupModal();
  };

  const handleimgTagRefClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      setGroupMembers([]);
      dispatch(setCreateGroupLoading(false));
    };
  }, []);

  return creatingGroup === true ? (
    <WorkModal title="Creating Group" />
  ) : (
    <div className="fixed inset-0 w-screen h-screen backdrop-blur-[4px] bg-transparent z-[1000] flex justify-center items-center">
      <div ref={refModal} className="flex flex-col gap-6 p-8">
        <form onSubmit={handleSubmit(createGroup)} className=" flex justify-center items-center gap-6 p-8">
          <div className="flex justify-center items-center relative size-11">
            <input
              id="imgInput"
              name="imageInput"
              ref={fileInputRef}
              className="absolute w-5 h-5  hidden"
              type="file"
              accept=".jpg ,.jpeg, .png"
              onChange={handleImageChange}
              placeholder=""
            />
            {selectedFile === null ? (
              <CiImageOn
                onClick={handleimgTagRefClick}
                className="block   absolute size-11 rounded bg-richblack-300 
            cursor-pointer"
              />
            ) : (
              <img
                src={URL.createObjectURL(selectedFile)}
                onClick={handleimgTagRefClick}
                className="block
              absolute size-11 object-cover rounded bg-richblack-300 cursor-pointer"
                alt="Avatar"
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Create Group"
            className=" w-[10rem] h-[3rem] bg-black p-4 text-white 
         rounded-md focus:border-[#8678F9] border-transparent border-2 focus:outline-none"
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
            className="relative inline-flex h-[3rem] w-fit items-center justify-center rounded-md
          bg-white px-4 font-medium text-gray-950 transition-colors"
          >
            <div
              className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe]
           to-[#8678f9] opacity-75 blur"
            />
            Create
          </button>
        </form>
        {/* friends */}
        <div
          className=" flex flex-wrap justify-center items-start gap-7 w-[35rem]  max-w-[40rem] text-white 
           max-h-[calc(100vh-50vh)] overflow-y-scroll"
        >
          {friends.map((friend, index) => {
            return (
              <div key={index} className=" flex w-fit items-center gap-x-3 bg-black text-white px-3 py-1 rounded-lg">
                {friend.imageUrl ? (
                  <img src={friend.imageUrl} className=" rounded-full  size-8 aspect-auto" alt="Loading..." />
                ) : (
                  <RxAvatar className=" size-8 aspect-auto" />
                )}
                <div className=" flex justify-center items-center gap-x-2 text-white text-xs">
                  <div>{friend.firstName}</div>
                  <div>{friend.lastName}</div>
                </div>
                {groupMembers.includes(friend._id) ? (
                  <CiCircleMinus
                    onClick={() => addMember(friend._id)}
                    className="text-black size-6 aspect-auto cursor-pointer bg-white  rounded-full"
                  />
                ) : (
                  <CiCirclePlus
                    onClick={() => addMember(friend._id)}
                    className=" text-white size-6 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full"
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
