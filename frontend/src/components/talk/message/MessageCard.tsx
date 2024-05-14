import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { getDTimeStamp } from "@/utils/getTime";
import FileItem from "@/components/talk/message/FileItem";

type MessageCardProps = {
  message: SoMessageRecieved;
};

const MessageCard = (props: MessageCardProps) => {
  return (
    <div className="ct-message self-end flex flex-col max-w-[75%]">
      {props.message.isFile ? (
        <FileItem url={props.message.text} />
      ) : (
        <p className=" text-[0.9rem] w-full break-words">
          {props.message.text}
        </p>
      )}
      <p className=" mt-2 self-end  text-snow-700 text-xs">
        {getDTimeStamp(props.message.createdAt)}
      </p>
    </div>
  );
};

export default MessageCard;
