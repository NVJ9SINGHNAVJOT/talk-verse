import "@/lib/cards/othermessagecard/OtherMessageCard.css";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { getDTimeStamp } from "@/utils/getTime";

type OtherMessageCardProps = {
  message: SoMessageRecieved;
};

const OtherMessageCard = (props: OtherMessageCardProps) => {
  return (
    <div className="othermessage self-start flex flex-col">
      <p>{props.message.text}</p>
      <p className=" mt-4">{getDTimeStamp(props.message.createdAt)}</p>
    </div>
  );
};

export default OtherMessageCard;
