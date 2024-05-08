import { Friend } from "@/redux/slices/chatSlice";
import { useAppSelector } from "@/redux/store";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export type ChatBarItemsProps = {
  friend: Friend;
};

const FriendBarItems = (props: ChatBarItemsProps) => {
  const friend = props.friend;
  const onlineFriends = useAppSelector((state) => state.chat.onlineFriends);
  const isTyping = useAppSelector((state) => state.chat.userTyping);
  const unseenMessages = useAppSelector((state) => state.chat.unseenMessages);
  const navigate = useNavigate();
  const goToChat = (chatId: string) => {
    navigate(`/talk/chat/${chatId}`);
  };

  return (
    <div
      onClick={() => goToChat(friend.chatId)}
      className=" relative w-full h-[3.8rem] flex justify-between items-center px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0 hover:bg-[#21262C]"
    >
      <div className="flex items-center">
        {friend.imageUrl ? (
          <img
            src={friend.imageUrl}
            alt="Loading..."
            className=" size-11 aspect-square rounded-2xl ring-2 ring-slate-400"
          />
        ) : (
          <RxAvatar className="  size-11 aspect-square text-white rounded-2xl ring-2 ring-slate-400" />
        )}
        <p className=" pl-4 text-white text-[1rem] pb-2">
          {friend.firstName + " " + friend.lastName}
        </p>
      </div>
      <div className=" flex gap-x-2 justify-center items-center">
        <div
          className={`${
            unseenMessages[friend.chatId] === 0 && " bg-transparent "
          } rounded-full bg-orange-500 text-white w-7 h-7 text-center`}
        >
          {unseenMessages[friend.chatId] === 0
            ? ""
            : unseenMessages[friend.chatId]}
        </div>
        <div
          className={` ${
            onlineFriends?.includes(friend._id) ? "bg-green" : "bg-transparent"
          } rounded-full  size-3`}
        ></div>
      </div>
      <div
        className={`${
          isTyping?.includes(friend._id) ? "opacity-100" : "opacity-0"
        } absolute z-40 bottom-[0.2rem] left-[4.7rem] text-yellow-500 text-xs`}
      >
        Typing...
      </div>
    </div>
  );
};

export default FriendBarItems;
