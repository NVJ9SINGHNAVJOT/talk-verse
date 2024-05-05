import { setTalkPageLoading } from "@/redux/slices/pageLoadingSlice";
import { chatBarDataApi } from "@/services/operations/chatApi";
import { getAllNotificationsApi } from "@/services/operations/notificationApi";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

interface SocketContextInterface {
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
  setupSocketConnection: () => Promise<void>;
  disconnectSocket: () => void;
}

type ContextProviderProps = {
  children?: ReactNode;
};

const SocketContext = createContext<SocketContextInterface | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = (): SocketContextInterface => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export default function SocketProvider({ children }: ContextProviderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const setupSocketConnection = async () => {
    try {
      const socketInstance = io(
        process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER as string,
        {
          withCredentials: true,
          autoConnect: false,
          extraHeaders: {
            Authorization: process.env.SERVER_KEY as string,
          },
        }
      );

      socketRef.current = socketInstance.connect();

      socketRef.current.on("connect", () => {
        setSocket(socketInstance);
      });

      socketRef.current.on("connect_error", () => {
        setSocket(null);
        socketRef.current = null;
        toast.error("Error in connection");
        navigate("/error");
      });

      if (socketRef.current) {
        const [res1, res2] = await Promise.all([
          getAllNotificationsApi(),
          chatBarDataApi(),
        ]);

        if (res1 && res2) {
          dispatch(setTalkPageLoading(false));
        }
      }
    } catch (error) {
      toast.error("Error while connecting");
      navigate("/error");
    }
  };

  const disconnectSocket = (): void => {
    socketRef.current?.disconnect();
    setSocket(null);
    socketRef.current = null;
  };

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, setupSocketConnection, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
}
