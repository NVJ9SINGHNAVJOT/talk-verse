import "@/lib/cards/messagecard/MessageCard.css";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { getDTimeStamp } from "@/utils/getTime";

type MessageCardProps = {
  message: SoMessageRecieved;
};

const MessageCard = (props: MessageCardProps) => {
  return (
    <div className="message self-end flex flex-col">
      <p className=" text-[0.9rem]" >{props.message.text}</p>
      <p className=" mt-2 self-end  text-snow-700 text-xs">
        {getDTimeStamp(props.message.createdAt)}
      </p>
    </div>
  );
};

export default MessageCard;
