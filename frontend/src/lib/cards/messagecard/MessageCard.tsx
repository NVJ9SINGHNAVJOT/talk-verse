import "@/lib/cards/messagecard/MessageCard.css";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { getDTimeStamp } from "@/utils/getTime";

type MessageCardProps = {
  message: SoMessageRecieved;
};

const MessageCard = (props: MessageCardProps) => {
  return (
    <div className="message self-end flex flex-col">
      <p>{props.message.text}</p>
      <p className=" mt-4 self-end">{getDTimeStamp(props.message.createdAt)}</p>
    </div>
  );
};

export default MessageCard;
