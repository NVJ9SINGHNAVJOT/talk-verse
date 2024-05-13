import "@/lib/cards/othergpmessagecard/OtherGpMessageCard.css";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { getDTimeStamp } from "@/utils/getTime";

type OtherGpMessageCardProps = {
  message: GroupMessages;
};

const OtherGpMessageCard = (props: OtherGpMessageCardProps) => {
  return (
    <div className="othermessage self-start flex flex-col">
      <p className=" text-[0.9rem]">{props.message.text}</p>
      <p className=" mt-2 self-start  text-snow-700 text-xs">
        {getDTimeStamp(props.message.createdAt)}
      </p>
    </div>
  );
};

export default OtherGpMessageCard;
