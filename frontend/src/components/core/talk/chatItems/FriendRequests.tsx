import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { deleteUserRequest, Friend, ChatBarData, addFriend, addChatBarData } from "@/redux/slices/chatSlice";
import { addPublicKey, PublicKey, addNewUnseen } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { acceptRequestApi, deleteRequestApi } from "@/services/operations/notificationApi";
import { useRef } from "react";
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
  const dispatch = useDispatch();

  useOnClickOutside(seeNotifRef, () => props.setSeeNotif(false), props.excSeeNotifRef);

  const acceptReq = async (userId: string) => {
    dispatch(deleteUserRequest(userId));
    const response = await acceptRequestApi(userId);
    if (response && response.success === true) {
      const newData: Friend & ChatBarData = {
        _id: response.newFriend._id,
        firstName: response.newFriend.firstName,
        lastName: response.newFriend.lastName,
        imageUrl: response.newFriend.imageUrl,
        chatId: response.newChatId,
      };
      dispatch(
        addPublicKey({
          userId: response.newFriend._id,
          publicKey: response.newFriendPublicKey,
        } as PublicKey)
      );
      dispatch(addFriend(newData));
      dispatch(addNewUnseen(response.newChatId));
      dispatch(addChatBarData(newData));
      toast.success("New friend added");
    } else {
      toast.error("Error while adding friend");
    }
  };

  const deleteReq = async (userId: string) => {
    dispatch(deleteUserRequest(userId));
    const response = await deleteRequestApi(userId);
    if (response) {
      toast.info("Request deleted");
    } else {
      toast.error("Error while deleting request");
    }
  };

  return (
    <div
      ref={seeNotifRef}
      className=" absolute z-[500] -top-3 -right-[18rem] rounded-xl gap-y-3 text-white flex flex-col px-5 py-2 bg-black"
    >
      {userRequests?.length === 0 ? (
        <div className=" bg-black px-3 py-1 text-white text-center w-[12rem]">No Requests</div>
      ) : (
        userRequests?.map((user, index) => {
          return (
            <div
              key={index}
              className=" flex w-fit items-center gap-x-3 bg-black hover:bg-gray-800 px-3 py-1 rounded-lg"
            >
              {user.imageUrl ? (
                <img src={user.imageUrl} className=" rounded-full w-10 h-10 aspect-auto" alt="Loading..." />
              ) : (
                <RxAvatar className="w-10 h-10 aspect-auto" />
              )}
              <div className=" truncate">{user.userName}</div>
              <CiCirclePlus
                onClick={() => acceptReq(user._id)}
                className=" text-white w-8 h-8 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full"
              />
              <CiCirclePlus
                onClick={() => deleteReq(user._id)}
                className=" text-white w-8 h-8 aspect-auto cursor-pointer rotate-45 hover:bg-white hover:text-black rounded-full"
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendRequests;
