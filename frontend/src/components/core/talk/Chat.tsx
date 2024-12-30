import OtherMessageCard from "@/components/core/talk/message/OtherMessageCard";
import MessageCard from "@/components/core/talk/message/MessageCard";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fileMessageApi, getMessagesApi } from "@/services/operations/chatApi";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { addPMessagesAsync, messagesSliceObject, resetUnseenMessage } from "@/redux/slices/messagesSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { MessageText } from "@/types/common";
import { sendMessageEvent } from "@/socket/emitEvents/emitMessageEvents";
import { useSocketContext } from "@/context/SocketContext";
import { startTypingEvent, stopTypingEvent } from "@/socket/emitEvents/emitNotificationEvents";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import FileInputs from "@/components/core/talk/chatItems/FileInputs";
import useScrollOnTop from "@/hooks/useScrollOnTop";
import { chatSliceObject, setChatBarDataToFirst } from "@/redux/slices/chatSlice";
import { loadingSliceObject } from "@/redux/slices/loadingSlice";

const Chat = () => {
  const pMessages = useAppSelector((state) => state.messages.pMess);
  const currUser = useAppSelector((state) => state.user.user);
  const myPublicKey = useAppSelector((state) => state.user.user?.publicKey);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<boolean>(true);
  const [firstMounting, setFirstMounting] = useState(true);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { socketRef } = useSocketContext();
  const navigate = useNavigate();
  const { chatId } = useParams();

  // initialLoad is for text input disable while messages re-render or render when chatId is changed
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useScrollTriggerVertical(scrollableDivRef, "up", setTrigger, stop, resetTrigger);
  useScrollOnTop(scrollableDivRef);

  // clean up for chat page
  useEffect(() => {
    return () => {
      messagesSliceObject.currFriendId = undefined;
      messagesSliceObject.mainChatId = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // work when chatId is changed is url
  useEffect(() => {
    if (!chatId || messagesSliceObject.mainChatId !== chatId) {
      navigate("/talk");
      return;
    }

    const getInitialChat = async () => {
      // reset unseenCount for chatId
      dispatch(resetUnseenMessage(chatId));

      // this function will only call api for a chatId messasges once
      if (messagesSliceObject.chatIdStart[chatId] === true) {
        setInitialLoad(false);
        return;
      }

      /* INFO: api is getting called for first time for chatId and this hook will call this api only once */
      messagesSliceObject.chatIdStart[chatId] = true;

      /*
        getLastCreatedAt if present in chatId messages and if not then create
        new date for current time and get messages
      */
      let lastCreatedAt;
      if (pMessages[chatId] !== undefined) {
        lastCreatedAt = pMessages[chatId][pMessages[chatId].length - 1].createdAt;
      } else {
        lastCreatedAt = new Date().toISOString();
      }

      // get messages for chatId
      const response = await getMessagesApi(chatId, lastCreatedAt);

      // check response from api
      if (!response) {
        toast.error("Error while getting messages for chat");
        setInitialLoad(false);
        messagesSliceObject.chatIdStart[chatId] = false;
        return;
      }
      // no messages for chatId yet if lastCreated in not present in pMessages
      // and if present then their are no futher messages for current chatId
      if (response.success === false || !response.messages) {
        messagesSliceObject.chatIdEnd[chatId] = true;
        setStop(true);
        setInitialLoad(false);
        return;
      }

      if (response.messages.length < 15) {
        messagesSliceObject.chatIdEnd[chatId] = true;
        setStop(true);
      }

      // check if their is any overlapping for messages for chatId
      if (pMessages[chatId] !== undefined) {
        while (response.messages.length > 0 && response.messages[0].createdAt > lastCreatedAt) {
          response.messages.splice(0, 1);
        }
      }

      // if any messages is present then dispatch
      if (response.messages.length > 0) {
        dispatch(addPMessagesAsync(response.messages));
      }
      setInitialLoad(false);
    };
    getInitialChat();

    return () => {
      setInitialLoad(true);
      setFirstMounting(true);
      setStop(false);
      setResetTrigger((prev) => !prev);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  /* ===== infinite loading of messages ===== */
  useEffect(() => {
    if (firstMounting) {
      setFirstMounting(false);
      return;
    }

    if (!chatId) {
      return;
    }

    const getMessages = async () => {
      if (
        loadingSliceObject.apiCalls[`getMessagesApi-${chatId}`] === true ||
        messagesSliceObject.chatIdEnd[chatId] === true
      ) {
        return;
      }
      /* INFO: getMessagesApi api call management */
      loadingSliceObject.apiCalls[`getMessagesApi-${chatId}`] = true;

      const response = await getMessagesApi(chatId, pMessages[chatId][pMessages[chatId].length - 1].createdAt);

      if (response) {
        // no futher messages for this chatId
        if (response.success === false || !response.messages || response.messages.length < 15) {
          messagesSliceObject.chatIdEnd[chatId] = true;
          setStop(true);
        }
        if (response.messages) {
          dispatch(addPMessagesAsync(response.messages));
        }
      } else {
        toast.error("Error while getting messages for chat");
      }

      setTimeout(() => {
        /* INFO: getMessagesApi api call management */
        loadingSliceObject.apiCalls[`getMessagesApi-${chatId}`] = false;
      }, 2000);
    };
    getMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const sendFileMessg = async (file: File) => {
    if (chatId && messagesSliceObject.currFriendId) {
      /* 
        for reference form data type required for api call
          FileData = {
          isGroup: string; "true" , "false"
          mainId: string; mainId is of chatId or groupId      

          to: string; for chat it is friendId and for group it is groupId
          firstName?: string;
          lastName?: string;
          imageUrl?: string;
        };
      */
      setWorkModal(true);
      const sendFile = new FormData();
      sendFile.append("fileMessg", file);
      sendFile.append("isGroup", "false");
      sendFile.append("mainId", chatId);
      sendFile.append("to", messagesSliceObject.currFriendId);

      const response = await fileMessageApi(sendFile);
      if (!response) {
        toast.error("Error while uploading file");
      } else {
        if (chatSliceObject.firstMainId !== chatId) {
          dispatch(setChatBarDataToFirst(chatId));
        }
      }
    } else {
      toast.error("Invalid chat");
    }
    setWorkModal(false);
  };

  const { register, handleSubmit, reset } = useForm<MessageText>();

  const sendMessage = (data: MessageText) => {
    if (!socketRef.current.connected) {
      toast.error("Network connection is not established");
      return;
    }
    if (!chatId || !messagesSliceObject.currFriendId) {
      toast.error("Invalid chat");
      return;
    }
    if (!myPublicKey || !messagesSliceObject.publicKeys[messagesSliceObject.currFriendId]) {
      toast.error("Encryption keys not present for chat");
      return;
    }
    reset();
    sendMessageEvent(
      socketRef.current,
      chatId,
      messagesSliceObject.currFriendId,
      data.text,
      myPublicKey,
      messagesSliceObject.publicKeys[messagesSliceObject.currFriendId]
    );
    if (chatSliceObject.firstMainId !== chatId) {
      dispatch(setChatBarDataToFirst(chatId));
    }
  };

  const startTyping = () => {
    if (!socketRef.current.connected) {
      toast.error("Network connection is not established");
      return;
    }
    if (!messagesSliceObject.currFriendId) {
      toast.error("Invalid chat");
      return;
    }
    startTypingEvent(socketRef.current, messagesSliceObject.currFriendId);
  };

  const stopTyping = () => {
    if (!socketRef.current.connected) {
      toast.error("Network connection is not established");
      return;
    }
    if (!messagesSliceObject.currFriendId) {
      toast.error("Invalid chat");
      return;
    }
    stopTypingEvent(socketRef.current, messagesSliceObject.currFriendId);
  };

  return (
    <div className="w-full h-full">
      <div ref={scrollableDivRef} className="w-full h-[90%] px-8 overflow-y-scroll flex flex-col-reverse">
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
        // skeleton
        <div className="relative w-full h-[10%] animate-pulse ">
          <div className=" w-10/12 h-[90%] mx-auto bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
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
