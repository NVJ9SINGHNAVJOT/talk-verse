import OtherMessageCard from "@/components/talk/message/OtherMessageCard";
import MessageCard from "@/components/talk/message/MessageCard";
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
  setMainChatId,
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
import { setWorkModal } from "@/redux/slices/loadingSlice";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import FileInputs from "./chatItems/FileInputs";

const Chat = () => {
  const currFriendId = useAppSelector((state) => state.messages.currFriendId);
  const mainChatId = useAppSelector((state) => state.messages.mainChatId);
  const lastMainId = useAppSelector((state) => state.chat.lastMainId);
  const pmessages = useAppSelector((state) => state.messages.pMess);
  const currUser = useAppSelector((state) => state.user.user);
  const workModal = useAppSelector((state) => state.loading.workModal);
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  /* ===== infinite loading of messages |start| ===== */
  const { chatId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const isMountingRef = useRef(true);
  const [lastCreatedAt, setLastCreateAt] = useState<string | undefined>(
    undefined
  );
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  useScrollTrigger(scrollableDivRef, setLoading, loading, setTrigger, stop);

  // clean up for chat page
  useEffect(() => {
    return () => {
      dispatch(setCurrFriendId(""));
      dispatch(setMainChatId(""));
      setLastCreateAt(undefined);
      dispatch(setPMessages([]));
      setLoading(true), setStop(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chatId || !currFriendId || !mainChatId || mainChatId !== chatId) {
      navigate("/talk");
    }

    if (isMountingRef.current) {
      isMountingRef.current = false;
      return;
    }
    setLastCreateAt(undefined);
    dispatch(setPMessages([]));
    setLoading(true), setStop(false);
    setTrigger((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // fetch data as per scroll
  useEffect(() => {
    const getMessages = async () => {
      if (chatId && currFriendId && chatId === mainChatId) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  /* ===== infinite loading of messages |end| ===== */

  const sendFileMessg = async (file: File) => {
    if (chatId && currFriendId) {
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
      dispatch(setWorkModal(true));
      const sendFile = new FormData();
      sendFile.append("fileMessg", file);
      sendFile.append("isGroup", "0");
      sendFile.append("mainId", chatId);
      sendFile.append("to", currFriendId);

      const response = await fileMessageApi(sendFile);
      if (!response) {
        toast.error("Error while uploading file");
      } else {
        if (!lastMainId || lastMainId !== chatId) {
          dispatch(setFriendToFirst(chatId));
        }
      }
    } else {
      toast.error("Invalid chat");
    }
    dispatch(setWorkModal(false));
  };

  const { register, handleSubmit, reset } = useForm<MessageText>();

  const sendMessage = (data: MessageText) => {
    reset();
    if (!socket) {
      toast.error("Network connection is not established");
      return;
    }
    if (!chatId || !currFriendId || !mainChatId) {
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
        {/* file inputs */}
        <FileInputs fileHandler={sendFileMessg} />
        {/* text input */}
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
              maxLength: 200,
            })}
            onFocus={() => startTyping()}
            onBlur={() => stopTyping()}
          />
        </div>
      </form>
      {workModal && <WorkModal title={"Uploading File"} />}
    </div>
  );
};

export default Chat;
