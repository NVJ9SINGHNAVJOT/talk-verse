import ChatBar from "@/components/core/talk/chatItems/UserChatBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";

const Talk = () => {
  const myPrivateKey = useAppSelector((state) => state.messages.myPrivateKey);
  const { setupSocketConnection } = useSocketContext();
  const navigate = useNavigate();
  const talkPageLd = useAppSelector((state) => state.loading.talkPageLd);

  useEffect(() => {
    const getWebSocketConnected = async () => {
      try {
        // only make connection if user is getting connected for first loading of talk page
        if (myPrivateKey !== undefined && talkPageLd === true) {
          await setupSocketConnection();
        } else {
          navigate("/checkKey");
        }
      } catch (error) {
        toast.error("Error while connecting");
      }
    };
    getWebSocketConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-grayblack">
      {talkPageLd ? (
        // skeleton
        <div className="flex h-[calc(100vh-4rem)] w-full bg-grayblack">
          {/* left bar chat list section*/}
          <section className="flex h-full w-3/12 animate-pulse items-center justify-center">
            <div className="h-[90%] w-10/12 rounded-xl bg-neutral-700" />
          </section>

          {/* right bar chat main section */}
          <section className="flex h-full w-9/12 animate-pulse flex-col items-center justify-evenly gap-y-8">
            <div className="h-[70%] w-10/12 rounded-xl bg-neutral-700" />
            <div className="h-[10%] w-10/12 rounded-xl bg-neutral-700" />
          </section>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-4rem)] w-full bg-grayblack">
          {/* left bar chat list section*/}
          <section className="h-full w-4/12 lg:w-3/12">
            <ChatBar />
          </section>

          {/* right bar chat main section */}
          <section className="h-full w-8/12 lg:w-9/12">
            <Outlet />
          </section>
        </div>
      )}
    </div>
  );
};

export default Talk;
