import { useSocketContext } from "@/context/SocketContext";
import useScrollTrigger from "@/hooks/useScrollTrigger";
import GpMessageCard from "@/components/core/talk/message/GpMessageCard";
import OtherGpMessageCard from "@/components/core/talk/message/OtherGpMessageCard";
import { setGroupToFirst } from "@/redux/slices/chatSlice";
import {
  addGpMessages,
  resetUnseenMessage,
  setGroupIdEnd,
  setGroupIdStart,
  setMainGroupId,
} from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import {
  fileMessageApi,
  getGroupMessagesApi,
} from "@/services/operations/chatApi";
import { sendGroupMessageEvent } from "@/socket/emitEvents/emitMessageEvents";
import { GetGroupMessagesRs } from "@/types/apis/chatApiRs";
import { MessageText } from "@/types/common";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FileInputs from "./chatItems/FileInputs";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import useScrollOnTop from "@/hooks/useScrollOnTop";
import { setApiCall } from "@/redux/slices/loadingSlice";

const Group = () => {
  const { register, handleSubmit, reset } = useForm<MessageText>();
  const mainGroupId = useAppSelector((state) => state.messages.mainGroupId);
  const gpMessages = useAppSelector((state) => state.messages.gpMess);
  const lastMainId = useAppSelector((state) => state.chat.lastMainId);
  const currUser = useAppSelector((state) => state.user.user);
  const groupIdStart = useAppSelector((state) => state.messages.groupIdStart);
  const groupIdEnd = useAppSelector((state) => state.messages.groupIdEnd);
  const apiCalls = useAppSelector((state) => state.loading.apiCalls);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [toggleTrigger, setToggleTrigger] = useState<boolean>(true);
  const [firstMounting, setFirstMounting] = useState(true);
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  // initialLoad is for text input disable while messages re-render or render when groupId is changed
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useScrollTrigger(scrollableDivRef, setTrigger, stop, toggleTrigger);
  useScrollOnTop(scrollableDivRef);

  // clean up for group page
  useEffect(() => {
    return () => {
      dispatch(setMainGroupId(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInitialLoad(true);
    if (!groupId || !mainGroupId || mainGroupId !== groupId) {
      navigate("/talk");
      return;
    }

    const getInitialGroup = async () => {
      // reset unseenCount for groupId
      dispatch(resetUnseenMessage(groupId));
      // this fucntion will only call api for a groupId messasges once
      if (
        groupIdStart[groupId] !== true &&
        apiCalls[`getGroupMessagesApi-${groupId}`] !== true
      ) {
        // api is getting called for first time for groupId and this hook will call this api only once
        /* ===== Caution: getGroupMessagesApi api call state management ===== */
        dispatch(
          setApiCall({ api: `getGroupMessagesApi-${groupId}`, status: true })
        );
        dispatch(setGroupIdStart(groupId));

        /*
          getLastCreatedAt if present in groupId messages and if not then create 
          new date for current time and get messages
        */

        let lastCreatedAt;
        if (gpMessages[groupId] !== undefined) {
          lastCreatedAt =
            gpMessages[groupId][gpMessages[groupId].length - 1].createdAt;
        } else {
          lastCreatedAt = new Date().toISOString();
        }

        // get messages for groupId
        const response: GetGroupMessagesRs = await getGroupMessagesApi(
          groupId,
          lastCreatedAt
        );

        // check response from api
        if (response) {
          // no messages for groupId yet if lastCreated in not present in gpMessages
          // and if present then their are no futher messages for current groupId
          if (
            response.success === false ||
            (response.messages && response.messages.length < 15)
          ) {
            dispatch(setGroupIdEnd(groupId));
            setStop(true);
          }

          // check if their is any overlapping for messages for groupId
          if (response.messages && gpMessages[groupId] !== undefined) {
            while (
              response.messages.length > 0 &&
              response.messages[0].createdAt > lastCreatedAt
            ) {
              response.messages.splice(0, 1);
            }
          }

          // if any messages is present then dispatch
          if (response.messages && response.messages.length > 0) {
            dispatch(addGpMessages(response.messages));
          }
        } else {
          toast.error("Error while getting messages for group");
        }
        dispatch(
          setApiCall({ api: `getGroupMessagesApi-${groupId}`, status: false })
        );
      }
      setInitialLoad(false);
    };
    getInitialGroup();

    return () => {
      setInitialLoad(true), setFirstMounting(true), setStop(false);
      setToggleTrigger((prev) => !prev);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  /* ===== infinite loading of messages ===== */
  useEffect(() => {
    if (!groupId || !mainGroupId || mainGroupId !== groupId) {
      navigate("/talk");
      return;
    }

    if (firstMounting) {
      setFirstMounting(false);
      return;
    }

    const getMessages = async () => {
      if (
        apiCalls[`getGroupMessagesApi-${groupId}`] !== true &&
        groupIdStart[groupId] === true &&
        groupIdEnd[groupId] !== true
      ) {
        /* ===== Caution: getMessagesApi api call state management ===== */
        dispatch(
          setApiCall({ api: `getGroupMessagesApi-${groupId}`, status: true })
        );

        const response: GetGroupMessagesRs = await getGroupMessagesApi(
          groupId,
          gpMessages[groupId][gpMessages[groupId].length - 1].createdAt
        );

        if (response) {
          // no futher messages for this groupId
          if (
            response.success === false ||
            (response.messages && response.messages.length < 15)
          ) {
            dispatch(setGroupIdEnd(groupId));
            setStop(true);
          }
          if (response.messages) {
            dispatch(addGpMessages(response.messages));
          }
        } else {
          toast.error("Error while getting messages for group");
        }

        setTimeout(() => {
          dispatch(
            setApiCall({ api: `getGroupMessagesApi-${groupId}`, status: false })
          );
        }, 2500);
      }
    };
    getMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const sendFileMssg = async (file: File) => {
    if (!currUser) {
      toast.error("User not present for message");
      return;
    }
    if (groupId) {
      setWorkModal(true);
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
      sendFile.append("fileMessg", file);
      sendFile.append("isGroup", "1");
      sendFile.append("mainId", groupId);
      sendFile.append("to", groupId);
      sendFile.append("firstName", currUser.firstName);
      sendFile.append("lastName", currUser.lastName);
      if (currUser.imageUrl) {
        sendFile.append("imageUrl", currUser.imageUrl);
      }

      const response = await fileMessageApi(sendFile);
      if (!response) {
        toast.error("Error while uploading file");
      } else {
        if (!lastMainId || lastMainId !== groupId) {
          dispatch(setGroupToFirst(groupId));
        }
      }
    } else {
      toast.error("Invalid group");
    }
    setWorkModal(false);
  };

  const sendGroupMessage = (data: MessageText) => {
    reset();
    if (!socket) {
      toast.error("Network connection is not established");
      return;
    }
    if (!groupId || !mainGroupId || !currUser) {
      toast.error("Invalid group");
      return;
    }

    sendGroupMessageEvent(
      socket,
      groupId,
      data.text,
      currUser.firstName,
      currUser.lastName,
      currUser.imageUrl ? currUser.imageUrl : ""
    );

    if (!lastMainId || lastMainId !== groupId) {
      dispatch(setGroupToFirst(groupId));
    }
  };

  return (
    <div className="w-full h-full">
      <div
        ref={scrollableDivRef}
        className="w-full h-[90%] px-8 overflow-y-scroll flex flex-col-reverse scroll-smooth "
      >
        {/* messages for group */}
        {groupId !== undefined && gpMessages[groupId] === undefined ? (
          <div className=" w-5/6 text-white font-be-veitnam-pro text-2xl p-7 text-center mx-auto my-auto">
            Let's talk chill thrill!
          </div>
        ) : (
          groupId !== undefined &&
          gpMessages[groupId].map((message, index) => {
            if (message.from._id === currUser?._id) {
              return <GpMessageCard key={index} message={message} />;
            }
            return <OtherGpMessageCard key={index} message={message} />;
          })
        )}
      </div>
      {/* message input */}
      {initialLoad ? (
        // skeleton
        <div className="relative w-full h-[10%] ">
          <div className=" w-10/12 h-[90%] mx-auto bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(sendGroupMessage)}
          className=" relative w-full h-[10%] flex justify-center items-center gap-x-4"
        >
          <FileInputs fileHandler={sendFileMssg} />
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
            />
          </div>
        </form>
      )}

      {workModal && <WorkModal title={"Uploading File"} />}
    </div>
  );
};

export default Group;
