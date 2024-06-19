import FileItem from "@/components/core/talk/message/FileItem";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { getDTimeStamp } from "@/utils/getTime";

type GpMessageCardProps = {
  message: GroupMessages;
};

const GpMessageCard = (props: GpMessageCardProps) => {
  return (
    <div className="ct-message self-end flex flex-col max-w-[75%]">
      {props.message.isFile ? (
        <FileItem url={props.message.text} />
      ) : (
        <p className=" text-[0.9rem] w-full break-words">{props.message.text}</p>
      )}
      <p className=" mt-2 self-end  text-snow-700 text-xs">{getDTimeStamp(props.message.createdAt)}</p>
    </div>
  );
};

export default GpMessageCard;
