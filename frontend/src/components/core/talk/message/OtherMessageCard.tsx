import { type SoMessageRecieved } from "@/types/socket/eventTypes";
import { getDTimeStamp } from "@/utils/getTime";
import FileItem from "@/components/core/talk/message/FileItem";

type OtherMessageCardProps = {
  message: SoMessageRecieved;
};

const OtherMessageCard = (props: OtherMessageCardProps) => {
  return (
    <div className="ct-othermessage self-start flex flex-col max-w-[75%]">
      {props.message.isFile ? (
        <FileItem url={props.message.text} />
      ) : (
        <p className=" text-[0.9rem] w-full break-words">{props.message.text}</p>
      )}
      <p className=" mt-2 self-start  text-snow-700 text-xs">{getDTimeStamp(props.message.createdAt)}</p>
    </div>
  );
};

export default OtherMessageCard;
