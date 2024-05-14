import { useSocketContext } from "@/context/SocketContext";
import useScrollTrigger from "@/hooks/useScrollTrigger";
import GpMessageCard from "@/components/talk/message/GpMessageCard";
import OtherGpMessageCard from "@/components/talk/message/OtherGpMessageCard";
import { setGroupToFirst } from "@/redux/slices/chatSlice";
import {
  addGpMessages,
  resetUnseenMessage,
  setGpMessages,
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
import { setWorkModal } from "@/redux/slices/loadingSlice";
import WorkModal from "@/lib/modals/workmodal/WorkModal";

const Group = () => {
  const { register, handleSubmit, reset } = useForm<MessageText>();
  const mainGroupId = useAppSelector((state) => state.messages.mainGroupId);
  const gpMessages = useAppSelector((state) => state.messages.gpMess);
  const lastMainId = useAppSelector((state) => state.chat.lastMainId);
  const currUser = useAppSelector((state) => state.user.user);
  const workModal = useAppSelector((state) => state.loading.workModal);
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  /* ===== infinite loading of messages |start| ===== */
  const { groupId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const isMountingRef = useRef(true);
  const [lastCreatedAt, setLastCreateAt] = useState<string | undefined>(
    undefined
  );
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  useScrollTrigger(scrollableDivRef, setLoading, loading, setTrigger, stop);

  // clean up for group page
  useEffect(() => {
    return () => {
      dispatch(setMainGroupId(""));
      setLastCreateAt(undefined);
      dispatch(setGpMessages([]));
      setLoading(true), setStop(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!groupId || !mainGroupId || mainGroupId !== groupId) {
      navigate("/talk");
    }

    if (isMountingRef.current) {
      isMountingRef.current = false;
      return;
    }
    setLastCreateAt(undefined);
    dispatch(setGpMessages([]));
    setLoading(true), setStop(false);
    setTrigger((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // fetch data as per scroll
  useEffect(() => {
    const getMessages = async () => {
      if (groupId && groupId === mainGroupId) {
        let response: GetGroupMessagesRs;
        // initial call for getting messages
        if (lastCreatedAt === undefined) {
          response = await getGroupMessagesApi(groupId);
          // setCount api call to set count 0
          if (response && response.messages && response.messages.length > 0) {
            dispatch(resetUnseenMessage(groupId));
          }
        } else if (lastCreatedAt !== undefined) {
          response = await getGroupMessagesApi(groupId, lastCreatedAt);
        } else {
          return;
        }

        if (response) {
          // no messages yet for this group
          if (response.success === false && !response.messages) {
            setStop(true);
          } else if (response.messages && response.messages.length > 0) {
            // no further messages for this group
            if (response.messages.length < 20) {
              setStop(true);
            }
            dispatch(addGpMessages(response.messages));
            setLastCreateAt(
              response.messages[response.messages.length - 1].createdAt
            );
          }
        } else {
          toast.error("Error while getting messages for group");
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

  const sendFileMssg = async (file: File) => {
    if (!currUser) {
      toast.error("User not present for message");
      return;
    }
    if (groupId) {
      dispatch(setWorkModal(true));
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
      toast.error("Invalid chat");
    }
    dispatch(setWorkModal(false));
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
        {/* messages for chat */}
        {gpMessages?.length === 0 ? (
          <div className=" w-5/6 text-white font-be-veitnam-pro text-2xl p-7 text-center mx-auto my-auto">
            Let's talk chill thrill!
          </div>
        ) : (
          gpMessages?.map((message, index) => {
            if (message.from._id === currUser?._id) {
              return <GpMessageCard key={index} message={message} />;
            }
            return <OtherGpMessageCard key={index} message={message} />;
          })
        )}
      </div>
      {/* message input */}
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
      {workModal && <WorkModal title={"Uploading File"} />}
    </div>
  );
};

export default Group;
