import ChatBar from "@/components/talk/UserChatBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";

const Talk = () => {
  const navigate = useNavigate();
  const { setupSocketConnection, disconnectSocket } = useSocketContext();

  useEffect(() => {
    const getSocket = async () => {
      try {
        await setupSocketConnection();
      } catch (error) {
        navigate('/error');
      }
    };
    getSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">

      {/* left bar chat list section*/}
      <section className="w-3/12 h-full">
        <ChatBar />
      </section>

      {/* right bar chat main section */}
      <section className="w-9/12 h-full">
        <Outlet />
      </section>

    </div>
  );
};

export default Talk;