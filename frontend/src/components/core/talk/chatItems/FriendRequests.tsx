import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { deleteUserRequest, Friend, ChatBarData, addFriend, addChatBarData } from "@/redux/slices/chatSlice";
import { addNewUnseen, messagesSliceObject } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { acceptRequestApi, deleteRequestApi } from "@/services/operations/notificationApi";
import { useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type FriendRequestsProps = {
  setSeeNotif: React.Dispatch<React.SetStateAction<boolean>>;
  excSeeNotifRef: React.RefObject<HTMLDivElement>;
};
const FriendRequests = (props: FriendRequestsProps) => {
  const seeNotifRef = useRef<HTMLDivElement>(null);
  const userRequests = useAppSelector((state) => state.chat.userRequests);
  const [answeringReq, setAnsweringReq] = useState<string[]>([]);
  const dispatch = useDispatch();

  useOnClickOutside(seeNotifRef, () => props.setSeeNotif(false), props.excSeeNotifRef);

  const acceptReq = async (userId: string) => {
    setAnsweringReq([...answeringReq, userId]);
    const response = await acceptRequestApi(userId);
    if (response && response.success === true) {
      dispatch(deleteUserRequest(userId));
      const newData: Friend & ChatBarData = {
        _id: response.newFriend._id,
        firstName: response.newFriend.firstName,
        lastName: response.newFriend.lastName,
        imageUrl: response.newFriend.imageUrl,
        chatId: response.newChatId,
      };
      messagesSliceObject.publicKeys[response.newFriend._id] = response.newFriendPublicKey;
      dispatch(addFriend(newData));
      dispatch(addNewUnseen(response.newChatId));
      dispatch(addChatBarData(newData));
      toast.success("New friend added");
    } else {
      toast.error("Error while adding friend");
    }
    setAnsweringReq((prev) => prev.filter((otherUserId) => otherUserId !== userId));
  };

  const deleteReq = async (userId: string) => {
    setAnsweringReq([...answeringReq, userId]);
    const response = await deleteRequestApi(userId);
    if (response) {
      dispatch(deleteUserRequest(userId));
      toast.info("Request deleted");
    } else {
      toast.error("Error while deleting request");
    }
    setAnsweringReq((prev) => prev.filter((otherUserId) => otherUserId !== userId));
  };

  return (
    <div
      ref={seeNotifRef}
      className="absolute -right-[18rem] z-[100] flex max-h-[60vh] flex-col gap-y-3 overflow-y-auto rounded-xl 
      bg-black px-5 py-2 text-white"
    >
      {userRequests?.length === 0 ? (
        <div className="w-[12rem] bg-black px-3 py-1 text-center text-white">No Requests</div>
      ) : (
        userRequests?.map((user, index) => {
          return (
            <div
              key={index}
              className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1 hover:bg-gray-800"
            >
              {user.imageUrl ? (
                <img src={user.imageUrl} className="aspect-auto h-10 w-10 rounded-full" alt="Loading..." />
              ) : (
                <RxAvatar className="aspect-auto h-10 w-10" />
              )}
              <div className="truncate">{user.userName}</div>
              <button disabled={answeringReq.includes(user._id)} onClick={() => acceptReq(user._id)}>
                <CiCirclePlus
                  className="aspect-auto h-8 w-8 cursor-pointer rounded-full text-white 
                hover:bg-white hover:text-black"
                />
              </button>
              <button disabled={answeringReq.includes(user._id)} onClick={() => deleteReq(user._id)}>
                <CiCirclePlus
                  className="aspect-auto h-8 w-8 rotate-45 cursor-pointer rounded-full text-white 
                hover:bg-white hover:text-black"
                />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendRequests;
