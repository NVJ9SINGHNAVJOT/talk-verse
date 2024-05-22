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
  setChatIdEnd,
  setChatIdStart,
  setCurrFriendId,
  setMainChatId,
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
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import FileInputs from "./chatItems/FileInputs";
import { Skeleton } from "@/lib/shadcn-ui/components/ui/skeleton";
import { setApiCall } from "@/redux/slices/loadingSlice";
import useScrollOnTop from "@/hooks/useScrollOnTop";

const Chat = () => {
  const apiCalls = useAppSelector((state) => state.loading.apiCalls);
  const chatIdStart = useAppSelector((state) => state.messages.chatIdStart);
  const chatIdEnd = useAppSelector((state) => state.messages.chatIdEnd);
  const currFriendId = useAppSelector((state) => state.messages.currFriendId);
  const mainChatId = useAppSelector((state) => state.messages.mainChatId);
  const lastMainId = useAppSelector((state) => state.chat.lastMainId);
  const pMessages = useAppSelector((state) => state.messages.pMess);
  const currUser = useAppSelector((state) => state.user.user);
  const myPublicKey = useAppSelector((state) => state.user.user?.publicKey);
  const publicKeys = useAppSelector((state) => state.messages.publicKeys);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [toggleTrigger, setToggleTrigger] = useState<boolean>(true);
  const [firstMounting, setFirstMounting] = useState(true);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { chatId } = useParams();

  // initialLoad is for text input disable while messages re-render or render when chatId is changed
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useScrollTrigger(scrollableDivRef, setTrigger, stop, toggleTrigger);
  useScrollOnTop(scrollableDivRef);

  // clean up for chat page
  useEffect(() => {
    return () => {
      dispatch(setCurrFriendId(""));
      dispatch(setMainChatId(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // work when chatId is changed is url
  useEffect(() => {
    if (!chatId || !currFriendId || !mainChatId || mainChatId !== chatId) {
      navigate("/talk");
      return;
    }

    const getInitialChat = async () => {
      // reset unseenCount for chatId
      dispatch(resetUnseenMessage(chatId));

      // this fucntion will only call api for a chatId messasges once
      if (
        chatIdStart[chatId] !== true &&
        apiCalls[`getMessagesApi-${chatId}`] !== true
      ) {
        // api is getting called for first time for chatId and this hook will call this api only once
        /* ===== Caution: getMessagesApi api call state management ===== */
        dispatch(setApiCall({ api: `getMessagesApi-${chatId}`, status: true }));
        dispatch(setChatIdStart(chatId));

        /*
          getLastCreatedAt if present in chatId messages and if not then create 
          new date for current time and get messages
        */
        let lastCreateAt;
        if (pMessages[chatId] !== undefined) {
          lastCreateAt =
            pMessages[chatId][pMessages[chatId].length - 1].createdAt;
        } else {
          lastCreateAt = new Date().toISOString();
        }

        // get messages for chatId
        const response: GetChatMessagesRs = await getMessagesApi(
          chatId,
          lastCreateAt
        );

        // check response from api
        if (response) {
          // no messages for chatId yet if lastCreated in not present in pMessages
          // and if present then their are no futher messages for current chatId
          if (
            response.success === false ||
            (response.messages && response.messages.length < 15)
          ) {
            dispatch(setChatIdEnd(chatId));
            setStop(true);
          }

          // check if their is any overlapping for messages for chatId
          if (response.messages && pMessages[chatId] !== undefined) {
            while (
              response.messages.length > 0 &&
              response.messages[0].createdAt > lastCreateAt
            ) {
              response.messages.splice(0, 1);
            }
          }

          // if any messages is present then dispatch
          if (response.messages && response.messages.length > 0) {
            dispatch(addPMessages(response.messages));
          }
        } else {
          toast.error("Error while getting messages for chat");
        }
        dispatch(
          setApiCall({ api: `getMessagesApi-${chatId}`, status: false })
        );
      }
      setInitialLoad(false);
    };
    getInitialChat();

    return () => {
      setInitialLoad(true), setFirstMounting(true);
      setStop(false), setToggleTrigger((prev) => !prev);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  /* ===== infinite loading of messages ===== */
  useEffect(() => {
    if (!chatId || !currFriendId || !mainChatId || mainChatId !== chatId) {
      navigate("/talk");
      return;
    }

    if (firstMounting) {
      setFirstMounting(false);
      return;
    }

    const getMessages = async () => {
      if (
        apiCalls[`getMessagesApi-${chatId}`] !== true &&
        chatIdStart[chatId] === true &&
        chatIdEnd[chatId] !== true
      ) {
        /* ===== Caution: getMessagesApi api call state management ===== */
        dispatch(setApiCall({ api: `getMessagesApi-${chatId}`, status: true }));

        const response: GetChatMessagesRs = await getMessagesApi(
          chatId,
          pMessages[chatId][pMessages[chatId].length - 1].createdAt
        );

        if (response) {
          // no futher messages for this chatId
          if (
            response.success === false ||
            (response.messages && response.messages.length < 15)
          ) {
            dispatch(setChatIdEnd(chatId));
            setStop(true);
          }
          if (response.messages) {
            dispatch(addPMessages(response.messages));
          }
        } else {
          toast.error("Error while getting messages for chat");
        }

        setTimeout(() => {
          dispatch(
            setApiCall({ api: `getMessagesApi-${chatId}`, status: false })
          );
        }, 2500);
      }
    };
    getMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const sendFileMessg = async (file: File) => {
    if (chatId && currFriendId) {
      /* 
        for reference form data type required for api call
          FileData = {
          isGroup: string;  "0"  ,  "1"  0 is false and 1 is true for api call
          mainId: string         

          to: string;
          firstName?: string;
          lastName?: string;
          imageUrl?: string;
        };
      */
      setWorkModal(true);
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
    setWorkModal(false);
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
    if (!myPublicKey || !publicKeys[currFriendId]) {
      toast.error("Encryption keys not present for chat");
      return;
    }

    sendMessageEvent(
      socket,
      chatId,
      currFriendId,
      data.text,
      myPublicKey,
      publicKeys[currFriendId]
    );
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
        className="w-full h-[90%] px-8 overflow-y-scroll flex flex-col-reverse"
      >
        {/* messages for chat */}
        {chatId !== undefined && pMessages[chatId] === undefined ? (
          <div className=" w-5/6 text-white font-be-veitnam-pro text-2xl p-7 text-center mx-auto my-auto">
            Let's talk chill thrill!
          </div>
        ) : (
          chatId !== undefined &&
          pMessages[chatId].map((message, index) => {
            if (message.from === currUser?._id) {
              return <MessageCard key={index} message={message} />;
            }
            return <OtherMessageCard key={index} message={message} />;
          })
        )}
      </div>
      {/* message input */}
      {initialLoad ? (
        <div className="relative w-full h-[10%] ">
          <Skeleton className=" w-10/12 h-[90%] mx-auto bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
        </div>
      ) : (
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
      )}

      {workModal && <WorkModal title={"Uploading File"} />}
    </div>
  );
};

export default Chat;
