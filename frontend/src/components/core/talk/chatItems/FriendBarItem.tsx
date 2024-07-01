import { Friend } from "@/redux/slices/chatSlice";
import { setCurrFriendId, setMainChatId } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export type FriendBarItemsProps = {
  friend: Friend;
  inChat: string;
  setInChat: React.Dispatch<React.SetStateAction<string>>;
};

const FriendBarItem = (props: FriendBarItemsProps) => {
  const friend = props.friend;
  const onlineFriends = useAppSelector((state) => state.chat.onlineFriends);
  const isTyping = useAppSelector((state) => state.chat.userTyping);
  const unseenMessages = useAppSelector((state) => state.messages.unseenMessages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToChat = () => {
    props.setInChat(friend.chatId);
    dispatch(setCurrFriendId(friend._id));
    dispatch(setMainChatId(friend.chatId));
    navigate(`/talk/chat/${friend.chatId}`);
  };

  return (
    <div
      onClick={() => goToChat()}
      className={` ${props.inChat === friend.chatId ? "bg-[#21262C]" : "hover:bg-[#21262C]"}
      relative w-full h-[3.8rem] flex justify-between items-center px-2 lg:px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0 `}
    >
      <div className="flex items-center">
        {friend.imageUrl ? (
          <img
            src={friend.imageUrl}
            alt="Loading..."
            className=" size-8 lg:size-11 aspect-square rounded-2xl ring-1 ring-slate-400"
          />
        ) : (
          <RxAvatar className=" size-8 lg:size-11 aspect-square text-white rounded-full  ring-1 ring-slate-400" />
        )}
        <p className=" pl-4 text-white text-[0.9rem] lg:text-[1rem] pb-2 truncate ">
          {friend.firstName + " " + friend.lastName}
        </p>
      </div>
      <div className=" flex gap-x-2 justify-center items-center">
        <div
          className={`${
            unseenMessages[friend.chatId] === 0 ? " bg-transparent " : "bg-orange-500"
          } rounded-full text-white size-6 lg:size-7 text-center text-sm flex justify-center items-center `}
        >
          <div className=" pb-[0.15rem]">
            {unseenMessages[friend.chatId] === 0 ? "" : unseenMessages[friend.chatId]}
          </div>
        </div>
        <div
          className={` ${
            onlineFriends?.includes(friend._id) ? "bg-green" : "bg-transparent"
          } rounded-full size-2  lg:size-3`}
        ></div>
      </div>
      <div
        className={`${
          isTyping?.includes(friend._id) ? "opacity-100" : "opacity-0"
        } absolute z-40 bottom-[0.2rem] left-[3.5rem] lg:left-[4.7rem] text-yellow-500 text-[0.6rem] lg:text-xs`}
      >
        typing...
      </div>
    </div>
  );
};

export default FriendBarItem;
