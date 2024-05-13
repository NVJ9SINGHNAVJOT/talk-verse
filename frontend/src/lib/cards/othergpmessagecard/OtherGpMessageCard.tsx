import "@/lib/cards/othergpmessagecard/OtherGpMessageCard.css";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { getDTimeStamp } from "@/utils/getTime";
import { RxAvatar } from "react-icons/rx";

type OtherGpMessageCardProps = {
  message: GroupMessages;
};

const OtherGpMessageCard = (props: OtherGpMessageCardProps) => {
  const imageUrl = props.message.from.imageUrl;

  return (
    <div className=" flex self-start gap-x-1">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Loading..."
          className=" size-6 rounded-full mt-4"
        />
      ) : (
        <RxAvatar className=" size-6 rounded-full m-4" />
      )}
      <div className="othermessage self-start flex flex-col">
        <p className=" text-[0.7rem] text-purple-400" >
          {props.message.from.firstName + " " + props.message.from.lastName}
        </p>
        <p className=" text-[0.9rem]">{props.message.text}</p>
        <p className=" mt-2 self-start  text-snow-700 text-xs">
          {getDTimeStamp(props.message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default OtherGpMessageCard;
