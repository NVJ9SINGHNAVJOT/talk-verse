import OtherMessageCard from "@/lib/cards/othermessagecard/OtherMessageCard";
import MessageCard from "@/lib/cards/messagecard/MessageCard";
import { MdAttachFile } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { getMessagesApi } from "@/services/operations/chatApi";
import { useParams } from "react-router-dom";
import useScrollTrigger from "@/hooks/useScrollTrigger";

const Chat = () => {
  const { chatId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [lastCreatedAt, setLastCreateAt] = useState<Date>();
  const pmessages = useAppSelector((state) => state.messages.pMess);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useScrollTrigger(scrollableDivRef, getMessagesApi);

  useEffect(() => {
    const getMessages = async () => {
      if (chatId) {
        const response = await getMessagesApi(chatId);
      }
    };
    getMessages();
  }, [chatId]);

  return (
    <div className="w-full h-full">
      <div
        ref={scrollableDivRef}
        className="w-full h-[90%] px-8 overflow-y-scroll flex flex-col-reverse"
      >
        {/* messages for chat */}
        {pmessages.length === 0 ? (
          <div className=" w-5/6 text-white font-be-veitnam-pro text-2xl">
            Let's talk chill thrill!
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {/* message input */}
      <div className=" relative w-full h-[10%] flex justify-center items-center gap-x-4">
        <MdAttachFile className=" fill-snow-800 hover:fill-white cursor-pointer size-10" />
        <input className=" absolute w-0 h-0" />
        <input
          className=" w-7/12 h-4/5 bg-black rounded-2xl text-white px-4 focus:outline-none 
        focus:bg-transparent border-b-2 border-transparent focus:border-emerald-800"
          placeholder="Message"
        />
      </div>
    </div>
  );
};

export default Chat;
