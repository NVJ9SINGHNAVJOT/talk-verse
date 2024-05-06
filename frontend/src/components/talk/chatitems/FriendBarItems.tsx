import { Friend } from "@/redux/slices/chatSlice";
import { useAppSelector } from "@/redux/store";
import { RxAvatar } from "react-icons/rx";

export type ChatBarItemsProps = {
  friend: Friend;
};

const ChatBarItems = (props: ChatBarItemsProps) => {
  const friend = props.friend;
  const onlineFriends = useAppSelector((state) => state.chat.onlineFriends);
  const isTyping = useAppSelector((state) => state.chat.userTyping);
  return (
    <div
      className=" relative w-full h-[3.8rem] flex justify-between items-center py-2 px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0 hover:bg-[#21262C]"
    >
      <div className="flex items-center">
        {friend.imageUrl ? (
          <img
            src={friend.imageUrl}
            alt="Loading..."
            className="w-10 h-10 aspect-square"
          />
        ) : (
          <RxAvatar className=" w-10 h-10 aspect-square text-white" />
        )}
        <p className=" pl-4 text-white text-[1rem">
          {friend.firstName + " " + friend.lastName}
        </p>
      </div>
      <div
        className={` ${
          onlineFriends?.includes(friend._id) ? "bg-green" : "bg-transparent"
        } rounded-full  size-3`}
      ></div>
      <div className={`${ isTyping?.includes(friend._id) ? "opacity-100" : "opacity-0"} absolute z-40 bottom-0 mx-auto`}>Typing...</div>
    </div>
  );
};

export default ChatBarItems;
