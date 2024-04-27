import ChatBar from "@/components/talk/chatitems/UserChatBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
import { Skeleton } from "@/lib/shadcn-ui/components/ui/skeleton";

const Talk = () => {
  const navigate = useNavigate();
  const pageLoading = useAppSelector((state) => state.pageLoading.pageLoading);

  const { setupSocketConnection, disconnectSocket } = useSocketContext();

  useEffect(() => {
    const getSocket = async () => {
      try {
        await setupSocketConnection();
      } catch (error) {
        toast.error("Error while connecting");
        navigate("/error");
      }
    };
    getSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
      {pageLoading ? (
        <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
          {/* left bar chat list section*/}
          <section className="w-3/12 h-full flex justify-center items-center">
            <Skeleton className=" w-10/12 h-[90%] bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
          </section>

          {/* right bar chat main section */}
          <section className="w-9/12 h-full flex gap-y-8 flex-col justify-evenly items-center">
            <Skeleton className=" w-10/12 h-[70%] bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
            <Skeleton className=" w-10/12 h-[10%] bg-[linear-gradient(315deg,_rgba(255,255,255,1)_0%,_rgba(36,106,120,1)_0%,_rgba(8,27,52,1)_100%,_rgba(37,181,16,1)_100%)]" />
          </section>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Talk;
