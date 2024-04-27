import { socketApi } from "@/services/operations/authApi";
import { setPageLoading } from "@/redux/slices/pageLoadingSlice";
import { SocketApiRs } from "@/types/apis/authApiRs";
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
  // eslint-disable-next-line no-unused-vars
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

  const setupSocketConnection = async (): Promise<void> => {
    try {
      const user: SocketApiRs = await socketApi();

      if (!user || !user.userId || user.success === false) {
        toast.error("Error while connecting");
        navigate("/error");
      }

      const socketInstance = io(
        process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER1 as string,
        {
          withCredentials: true,
          autoConnect: false,
          extraHeaders: {
            Authorization: user.userId,
            Api_Key: process.env.SERVER1_KEY as string,
          },
        }
      );

      socketRef.current = socketInstance.connect();

      socketRef.current.on("connect", () => {
        setSocket(socketInstance);
        dispatch(setPageLoading(false));
      });

      socketRef.current.on("connect_error", () => {
        toast.error("Error while connecting");
        navigate("/error");
      });
    } catch (error) {
      toast.error("Error while connecting");
      navigate("/error");
    }
  };

  const disconnectSocket = (): void => {
    socketRef.current?.disconnect();
    setSocket(null);
  };

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, setupSocketConnection, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
}
