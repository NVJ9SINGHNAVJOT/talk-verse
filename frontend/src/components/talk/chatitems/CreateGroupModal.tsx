import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { CiCirclePlus, CiImageOn, CiCircleMinus } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

type CreateGroupModalProps = {
  toggelCreateGroupModal: () => void;
};

const CreateGroupModal = (props: CreateGroupModalProps) => {
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const addMember = (_id: string) => {
    if (!groupMembers.includes(_id)) {
      setGroupMembers((prev) => [...prev, _id]);
    } else {
      setGroupMembers(() =>
        groupMembers.filter((friendId) => friendId !== _id)
      );
    }
  };
  const friends = useAppSelector((state) => state.chat.friends);
  const { toggelCreateGroupModal } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (validTypes.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
        setSelectedFile(null);
      }
    }
  };

  const handleimgTagRefClick = () => {
    fileInputRef.current?.click();
  };

  const refModal = useRef<HTMLDivElement>(null);

  useOnClickOutside(refModal, toggelCreateGroupModal);

  useEffect(() => {
    return () => {
      setGroupMembers([]);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen backdrop-blur-[4px] bg-transparent z-[1000] flex justify-center items-center">
      <div ref={refModal} className=" flex flex-col gap-6 p-8">
        <div className=" flex justify-center items-center gap-6 p-8">
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
          />
          <button
            className="relative inline-flex h-[3rem] w-fit items-center justify-center rounded-md
           bg-white px-4 font-medium text-gray-950 transition-colors focus:outline-none focus:ring-2
            focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <div
              className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe]
             to-[#8678f9] opacity-75 blur"
            />
            Create
          </button>
        </div>
        {/* friends */}
        <div
          className=" flex flex-wrap justify-center items-start gap-7 sm:w-[35rem]  max-w-[40rem] text-white 
             max-h-[calc(100vh-50vh)] overflow-y-scroll"
        >
          {friends.map((friend, index) => {
            return (
              <div
                key={index}
                className=" flex w-fit items-center gap-x-3 bg-black text-white px-3 py-1 rounded-lg"
              >
                {friend.imageUrl ? (
                  <img
                    src={friend.imageUrl}
                    className=" rounded-full  size-8 aspect-auto"
                    alt="Loading..."
                  />
                ) : (
                  <RxAvatar className=" size-8 aspect-auto" />
                )}
                <div>{friend.firstName}</div>
                <div>{friend.lastName}</div>
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
