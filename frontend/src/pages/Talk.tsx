import ChatBar from "@/components/core/talk/chatItems/UserChatBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
import { setTalkPageLoading } from "@/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import {
  setChatBarData,
  setFriends,
  setGroups,
  setOnlineFriend,
  resetTyping,
  setLastMainId,
  setUserRequests,
} from "@/redux/slices/chatSlice";
import {
  resetChatIdEnd,
  resetChatIdStart,
  resetGpMess,
  resetGroupIdEnd,
  resetGroupIdStart,
  resetPMess,
  setMyId,
  setPublicKeys,
  setUnseenMessages,
} from "@/redux/slices/messagesSlice";

const Talk = () => {
  const myPrivateKey = useAppSelector((state) => state.messages.myPrivateKey);
  const { setupSocketConnection, disconnectSocket } = useSocketContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const talkPageLd = useAppSelector((state) => state.loading.talkPageLd);

  useEffect(() => {
    dispatch(setTalkPageLoading(true));
    const getSocket = async () => {
      try {
        if (myPrivateKey !== undefined) {
          await setupSocketConnection();
        } else {
          navigate("/checkKey");
        }
      } catch (error) {
        toast.error("Error while connecting");
      }
    };
    getSocket();

    return () => {
      disconnectSocket();
      dispatch(setTalkPageLoading(true));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clean up for talk page
  useEffect(() => {
    return () => {
      // chatSlice
      dispatch(setChatBarData([]));
      dispatch(setFriends([]));
      dispatch(setGroups([]));
      dispatch(setOnlineFriend([]));
      dispatch(setUnseenMessages({}));
      dispatch(resetTyping());
      dispatch(setLastMainId(""));
      dispatch(setUserRequests([]));

      // messagesSlice
      dispatch(setPublicKeys({}));
      dispatch(setMyId(""));
      dispatch(resetPMess());
      dispatch(resetGpMess());
      dispatch(resetChatIdStart());
      dispatch(resetChatIdEnd());
      dispatch(resetGroupIdStart());
      dispatch(resetGroupIdEnd());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
      {talkPageLd ? (
        // skeleton
        <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
          {/* left bar chat list section*/}
          <section className="w-3/12 h-full flex justify-center items-center animate-pulse">
            <div className=" w-10/12 h-[90%] rounded-xl bg-neutral-700" />
          </section>

          {/* right bar chat main section */}
          <section className="w-9/12 h-full flex gap-y-8 flex-col justify-evenly items-center animate-pulse">
            <div className=" w-10/12 h-[70%] rounded-xl bg-neutral-700" />
            <div className=" w-10/12 h-[10%] rounded-xl bg-neutral-700" />
          </section>
        </div>
      ) : (
        <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
          {/* left bar chat list section*/}
          <section className="w-4/12 lg:w-3/12 h-full">
            <ChatBar />
          </section>

          {/* right bar chat main section */}
          <section className="w-8/12 lg:w-9/12 h-full">
            <Outlet />
          </section>
        </div>
      )}
    </div>
  );
};

export default Talk;
