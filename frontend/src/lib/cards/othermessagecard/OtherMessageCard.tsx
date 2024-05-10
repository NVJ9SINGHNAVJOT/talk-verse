import "@/lib/cards/othermessagecard/OtherMessageCard.css";
import { SoMessageRecieved } from "@/types/socket/eventTypes";

type OtherMessageCardProps = {
  message: SoMessageRecieved;
};

const OtherMessageCard = (props: OtherMessageCardProps) => {
  return (
    <div className="othermessage self-start flex flex-col">
      <p>{props.message.text}</p>
      <p className=" mt-4">18:00</p>
    </div>
  );
};

export default OtherMessageCard;
