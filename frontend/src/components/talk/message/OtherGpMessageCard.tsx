import { GroupMessages } from "@/redux/slices/messagesSlice";
import { getDTimeStamp } from "@/utils/getTime";
import { RxAvatar } from "react-icons/rx";
import FileItem from "@/components/talk/message/FileItem";

type OtherGpMessageCardProps = {
  message: GroupMessages;
};

const OtherGpMessageCard = (props: OtherGpMessageCardProps) => {
  const imageUrl = props.message.from.imageUrl;

  return (
    <div className=" flex self-start gap-x-1 max-w-[75%]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Loading..."
          className=" size-6 rounded-full mt-4 z-50"
        />
      ) : (
        <RxAvatar className=" size-6 rounded-full fill-slate-500 mt-4 z-50" />
      )}
      <div className="ct-othermessage self-start flex flex-col w-full">
        <p className=" text-[0.7rem] text-purple-400">
          {props.message.from.firstName + " " + props.message.from.lastName}
        </p>
        {props.message.isFile ? (
          <FileItem url={props.message.text} />
        ) : (
          <p className=" text-[0.9rem] w-full break-words">
            {props.message.text}
          </p>
        )}
        <p className=" mt-2 self-start  text-snow-700 text-xs">
          {getDTimeStamp(props.message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default OtherGpMessageCard;
