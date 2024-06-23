import {
  resetTyping,
  setChatBarData,
  setFriends,
  setGroups,
  setLastMainId,
  setOnlineFriend,
  setUserRequests,
} from "@/redux/slices/chatSlice";
import {
  PublicKeys,
  resetChatIdAndGroupIdPoints,
  resetGpMess,
  resetPMess,
  setPublicKeys,
  setUnseenMessages,
  UnseenMessages,
} from "@/redux/slices/messagesSlice";
import { setTalkPageLoading } from "@/redux/slices/loadingSlice";
import { chatBarDataApi } from "@/services/operations/chatApi";
import { checkOnlineFriendsApi, getAllNotificationsApi } from "@/services/operations/notificationApi";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { clientE } from "@/socket/events";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const talkPageCleanUp = () => {
    // set talk page loading true
    dispatch(setTalkPageLoading(true));

    // chatSlice
    dispatch(setChatBarData([]));
    dispatch(setFriends([]));
    dispatch(setGroups([]));
    dispatch(setOnlineFriend([]));
    dispatch(setUnseenMessages({}));
    dispatch(resetTyping());
    dispatch(setLastMainId(undefined));
    dispatch(setUserRequests([]));

    // messagesSlice
    dispatch(setPublicKeys({}));
    dispatch(resetPMess());
    dispatch(resetGpMess());
    dispatch(resetChatIdAndGroupIdPoints());
  };

  const setupSocketConnection = async () => {
    try {
      const socketInstance = io(process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER as string, {
        withCredentials: true,
        autoConnect: false,
        extraHeaders: {
          // serverKey for access
          Authorization: process.env.SERVER_KEY as string,
        },
      });

      const [res1, res2, res3] = await Promise.all([
        getAllNotificationsApi(),
        chatBarDataApi(),
        checkOnlineFriendsApi(),
      ]);

      if (res1 && res2 && res3) {
        if (res1.success === true) {
          if (res1.unseenMessages) {
            const newUnseenMessages: UnseenMessages = {};
            res1.unseenMessages.forEach((messages) => {
              newUnseenMessages[messages.mainId] = messages.count;
            });
            dispatch(setUnseenMessages(newUnseenMessages));
          }
          if (res1.userReqs) {
            dispatch(setUserRequests(res1.userReqs));
          }
        }

        if (res2.success === true) {
          if (res2.friends) dispatch(setFriends(res2.friends));
          if (res2.groups) dispatch(setGroups(res2.groups));
          if (res2.chatBarData) dispatch(setChatBarData(res2.chatBarData));
          if (res2.friendPublicKeys) {
            const newFriendKeys: PublicKeys = {};
            res2.friendPublicKeys.forEach((data) => {
              newFriendKeys[data.friendId] = data.publicKey;
            });
            dispatch(setPublicKeys(newFriendKeys));
          }
        }

        if (res3.success === true && res3.onlineFriends) {
          dispatch(setOnlineFriend(res3.onlineFriends));
        }

        // all response are valid for talk page, now connect to web socket server
        socketRef.current = socketInstance.connect();
        socketRef.current.on("connect", () => {
          setSocket(socketInstance);
          setTimeout(() => {
            dispatch(setTalkPageLoading(false));
          }, 700);
        });
        socketRef.current.on("connect_error", () => {
          setSocket(null);
          socketRef.current = null;
          toast.error("Error in connection");
          navigate("/error");
          // if error in connection then clear all state for talk page
          talkPageCleanUp();
        });
      } else {
        toast.error("Error while getting talk page data");
        navigate("/error");
      }
    } catch (error) {
      toast.error("Error while connecting");
      navigate("/error");
    }
  };

  const disconnectSocket = (): void => {
    if (socket) {
      socket.off(clientE.USER_REQUEST);
      socket.off(clientE.REQUEST_ACCEPTED);
      socket.off(clientE.ADDED_IN_GROUP);
      socket.off(clientE.GROUP_MESSAGE_RECIEVED);
      socket.off(clientE.MESSAGE_RECIEVED);
      socket.off(clientE.OTHER_START_TYPING);
      socket.off(clientE.OTHER_STOP_TYPING);
      socket.off(clientE.SET_USER_ONLINE);
      socket.off(clientE.SET_USER_OFFLINE);
    }
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);
    talkPageCleanUp();
  };

  return (
    <SocketContext.Provider value={{ socket, setSocket, setupSocketConnection, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
