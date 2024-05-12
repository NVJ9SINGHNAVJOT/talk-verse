import OtherMessageCard from "@/lib/cards/othermessagecard/OtherMessageCard";
import MessageCard from "@/lib/cards/messagecard/MessageCard";
import { MdAttachFile } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { fileMessageApi, getMessagesApi } from "@/services/operations/chatApi";
import { useNavigate, useParams } from "react-router-dom";
import useScrollTrigger from "@/hooks/useScrollTrigger";
import { GetChatMessagesRs } from "@/types/apis/chatApiRs";
import { useDispatch } from "react-redux";
import {
  addPMessages,
  resetUnseenMessage,
  setCurrFriendId,
  setMainId,
  setPMessages,
} from "@/redux/slices/messagesSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { MessageText } from "@/types/common";
import { sendMessageEvent } from "@/socket/emitEvents/emitMessageEvents";
import { useSocketContext } from "@/context/SocketContext";
import {
  startTypingEvent,
  stopTypingEvent,
} from "@/socket/emitEvents/emitNotificationEvents";
import { setFriendToFirst } from "@/redux/slices/chatSlice";

const Chat = () => {
  const currFriendId = useAppSelector((state) => state.messages.currFriendId);
  const currMainId = useAppSelector((state) => state.messages.currMainId);
  const lastMainId = useAppSelector((state) => state.chat.lastMainId);
  const { chatId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<number>(0);
  const [trigAssist, setTrigAssist] = useState<boolean>(false);
  const isMountingRef = useRef(true);
  const [lastCreatedAt, setLastCreateAt] = useState<string | undefined>(
    undefined
  );
  const pmessages = useAppSelector((state) => state.messages.pMess);
  const currUser = useAppSelector((state) => state.user.user);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  useScrollTrigger(scrollableDivRef, setLoading, loading, setTrigger, stop);

  useEffect(() => {
    return () => {
      dispatch(setCurrFriendId(""));
      dispatch(setMainId(""));
    };
  }, []);

  useEffect(() => {
    if (!chatId || !currFriendId || !currMainId || currMainId !== chatId) {
      navigate("/talk");
    }

    if (isMountingRef.current) {
      isMountingRef.current = false;
      return;
    }
    setLastCreateAt(undefined);
    dispatch(setPMessages([]));
    setLoading(true), setStop(false);
    if (trigger === 0) {
      setTrigAssist((prev) => !prev);
    } else {
      setTrigger(0);
    }
  }, [chatId]);

  // infinite loading of messages
  useEffect(() => {
    const getMessages = async () => {
      if (chatId && currFriendId && chatId === currMainId) {
        let response: GetChatMessagesRs;
        // initial call for getting messages
        if (lastCreatedAt === undefined) {
          response = await getMessagesApi(chatId);
          // setCount api call to set count 0
          if (response && response.messages && response.messages.length > 0) {
            dispatch(resetUnseenMessage(chatId));
          }
        } else if (lastCreatedAt !== undefined) {
          response = await getMessagesApi(chatId, lastCreatedAt);
        } else {
          return;
        }

        if (response) {
          // no messages yet for this chatId
          if (response.success === false && !response.messages) {
            setStop(true);
          } else if (response.messages && response.messages.length > 0) {
            // no further messages for this chatId
            if (response.messages.length < 20) {
              setStop(true);
            }
            dispatch(addPMessages(response.messages));
            setLastCreateAt(
              response.messages[response.messages.length - 1].createdAt
            );
          }
        } else {
          toast.error("Error while getting messages for chat");
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    getMessages();
  }, [trigger, trigAssist]);

  const handleFileTagRefClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (validTypes.includes(fileType) && chatId && currFriendId) {
        /* for reference form data type required for api call
            FileData = {
            isGroup: string;  "0"  ,  "1"  0 is false and 1 is true for api call
            mainId: string         
  
            to: string;
            firstName?: string;
            lastName?: string;
            imageUrl?: string;
          };
        */
        const sendFile = new FormData();
        sendFile.append("imageFile", file);
        sendFile.append("isGroup", "0");
        sendFile.append("mainId", chatId);
        sendFile.append("to", currFriendId);

        fileMessageApi(sendFile);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
      }
    }
  };

  const { register, handleSubmit, reset } = useForm<MessageText>();

  const sendMessage = (data: MessageText) => {
    reset();
    if (!socket) {
      toast.error("Network connection is not established");
      return;
    }
    if (!chatId || !currFriendId || !currMainId) {
      toast.error("Invalid chat");
      return;
    }

    sendMessageEvent(socket, chatId, currFriendId, data.text);
    if (!lastMainId || lastMainId !== chatId) {
      dispatch(setFriendToFirst(chatId));
    }
  };

  const startTyping = () => {
    if (!socket) {
      toast.error("Network connection is not established");
      return;
    }
    if (!currFriendId) {
      toast.error("Invalid chat");
      return;
    }
    startTypingEvent(socket, currFriendId);
  };

  const stopTyping = () => {
    if (!socket) {
      toast.error("Network connection is not established");
      return;
    }
    if (!currFriendId) {
      toast.error("Invalid chat");
      return;
    }
    stopTypingEvent(socket, currFriendId);
  };

  return (
    <div className="w-full h-full">
      <div
        ref={scrollableDivRef}
        className="w-full h-[90%] px-8 overflow-y-scroll flex flex-col-reverse scroll-smooth "
      >
        {/* messages for chat */}
        {pmessages?.length === 0 ? (
          <div className=" w-5/6 text-white font-be-veitnam-pro text-2xl p-7 text-center mx-auto my-auto">
            Let's talk chill thrill!
          </div>
        ) : (
          pmessages?.map((message, index) => {
            if (message.from === currUser?._id) {
              return <MessageCard key={index} message={message} />;
            }
            return <OtherMessageCard key={index} message={message} />;
          })
        )}
      </div>
      {/* message input */}
      <form
        onSubmit={handleSubmit(sendMessage)}
        className=" relative w-full h-[10%] flex justify-center items-center gap-x-4"
      >
        <MdAttachFile
          onClick={handleFileTagRefClick}
          className=" fill-snow-800 hover:fill-white cursor-pointer size-10"
        />
        <input
          ref={fileInputRef}
          onChange={handleFileChange}
          className=" absolute w-0 h-0"
          type="file"
          accept=".jpg , .jpeg, .png"
        />
        <div className="relative w-7/12 h-4/5">
          <button type="submit" className=" w-0 h-0 absolute -z-10 ">
            Submit
          </button>
          <input
            type="text"
            className="w-full h-full  bg-black rounded-2xl text-white px-4 focus:outline-none 
            focus:bg-transparent border-b-2 border-transparent focus:border-emerald-800"
            placeholder="Message"
            {...register("text", {
              required: true,
              minLength: 1,
              maxLength: 50,
            })}
            onFocus={() => startTyping()}
            onBlur={() => stopTyping()}
          />
        </div>
      </form>
    </div>
  );
};

export default Chat;
