import "@/lib/cards/gpmessagecard/GpMessageCard.css";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { getDTimeStamp } from "@/utils/getTime";

type GpMessageCardProps = {
  message: GroupMessages;
};

const GpMessageCard = (props: GpMessageCardProps) => {
  return (
    <div className="message self-end flex flex-col">
      <p className=" text-[0.9rem]" >{props.message.text}</p>
      <p className=" mt-2 self-end  text-snow-700 text-xs">
        {getDTimeStamp(props.message.createdAt)}
      </p>
    </div>
  );
};

export default GpMessageCard;
