import {
  addChatBarData,
  addFriend,
  addOnlineFriend,
  addUserRequest,
  addUserTyping,
  chatSliceObject,
  Friend,
  removeOnlineFriend,
  removeUserTyping,
  resetTyping,
  setChatBarData,
  setFriends,
  setOnlineFriend,
  setUserRequests,
  UserRequest,
} from "@/redux/slices/chatSlice";
import {
  addLiveGpMessage,
  addLivePMessage,
  addNewUnseen,
  GroupMessage,
  messagesSliceObject,
  resetGpMess,
  resetPMess,
  setUnseenMessages,
} from "@/redux/slices/messagesSlice";
import { loadingSliceObject, setTalkPageLoading } from "@/redux/slices/loadingSlice";
import { chatBarDataApi } from "@/services/operations/chatApi";
import { checkOnlineFriendsApi, getAllNotificationsApi } from "@/services/operations/notificationApi";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { clientE } from "@/socket/events";
import {
  SoUserRequest,
  SoRequestAccepted,
  SoAddedInGroup,
  SoMessageRecieved,
  SoGroupMessageRecieved,
} from "@/types/socket/eventTypes";

interface SocketContextInterface {
  socketRef: React.MutableRefObject<Socket | null>;
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
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const talkPageCleanUp = () => {
    loadingSliceObject.apiCalls["talk"] = false;
    // set talk page loading true
    dispatch(setTalkPageLoading(true));

    // chatSlice
    dispatch(setChatBarData([]));
    dispatch(setFriends([]));
    dispatch(setOnlineFriend([]));
    dispatch(setUnseenMessages({}));
    dispatch(resetTyping());
    dispatch(setUserRequests([]));
    chatSliceObject.firstMainId = "";

    // messagesSlice
    dispatch(resetPMess());
    dispatch(resetGpMess());
    messagesSliceObject.chatIdStart = {};
    messagesSliceObject.chatIdEnd = {};
    messagesSliceObject.groupIdStart = {};
    messagesSliceObject.groupIdEnd = {};
    messagesSliceObject.publicKeys = {};
    messagesSliceObject.myPrivateKey = undefined;
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
        getAllNotificationsApi(), // res1
        chatBarDataApi(), // res2
        checkOnlineFriendsApi(), // res3
      ]);

      if (!res1 || !res2 || !res3) {
        toast.error("Error while getting talk page data");
        navigate("/");
        return;
      }

      if (res1.success === true) {
        if (res1.unseenMessages) {
          const newUnseenMessages: Record<string, number> = {};
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
        if (res2.chatBarData) dispatch(setChatBarData(res2.chatBarData));
        if (res2.friendPublicKeys) {
          res2.friendPublicKeys.forEach((data) => {
            messagesSliceObject.publicKeys[data.friendId] = data.publicKey;
          });
        }
      }

      if (res3.success === true && res3.onlineFriends) {
        dispatch(setOnlineFriend(res3.onlineFriends));
      }

      /* all response are valid for talk page, now connect to web socket server */
      socketRef.current = socketInstance.connect();
      /* 
        user is connected with web socket server then register socket events
        all event listeners are registered here 
      */
      const socket = socketRef.current;

      socketRef.current.on("connect_error", () => {
        socketRef.current = null;
        toast.error("Error in connection");
        // if error in connection then clear all state for talk page
        talkPageCleanUp();
        navigate("/");
      });

      socket.on("connect", () => {
        setTimeout(() => {
          dispatch(setTalkPageLoading(false));
        }, 500);
      });

      /* ===== socket events start ===== */
      socket.on(clientE.USER_REQUEST, (data: SoUserRequest) => {
        dispatch(
          addUserRequest({
            _id: data._id,
            userName: data.userName,
            imageUrl: data.imageUrl,
          } satisfies UserRequest as UserRequest)
        );
        toast.info("New friend request");
      });

      socket.on(clientE.REQUEST_ACCEPTED, (data: SoRequestAccepted) => {
        messagesSliceObject.publicKeys[data._id] = data.publicKey;
        const newFriend: Friend = {
          _id: data._id,
          chatId: data.chatId,
          firstName: data.firstName,
          lastName: data.lastName,
          imageUrl: data.imageUrl,
        };
        dispatch(addFriend(newFriend));
        dispatch(addChatBarData(newFriend));
        dispatch(addNewUnseen(data.chatId));
        toast.success("New friend added");
      });

      socket.on(clientE.ADDED_IN_GROUP, (data: SoAddedInGroup) => {
        dispatch(addNewUnseen(data._id));
        dispatch(addChatBarData(data));
        toast.success("Added in new Group");
      });

      socket.on(clientE.MESSAGE_RECIEVED, (data: SoMessageRecieved) => {
        dispatch(addLivePMessage(data));
      });

      socket.on(clientE.GROUP_MESSAGE_RECIEVED, (data: SoGroupMessageRecieved) => {
        const newGpMessage: GroupMessage = {
          uuId: data.uuId,
          isFile: data.isFile,
          from: {
            _id: data.from,
            firstName: data.firstName,
            lastName: data.lastName,
            imageUrl: data.imageUrl,
          },
          to: data.to,
          text: data.text,
          createdAt: data.createdAt,
        };
        dispatch(addLiveGpMessage(newGpMessage));
      });

      socket.on(clientE.OTHER_START_TYPING, (friendId: string) => {
        dispatch(addUserTyping(friendId));
      });

      socket.on(clientE.OTHER_STOP_TYPING, (friendId: string) => {
        dispatch(removeUserTyping(friendId));
      });

      socket.on(clientE.SET_USER_ONLINE, (friendId: string) => {
        dispatch(addOnlineFriend(friendId));
      });

      socket.on(clientE.SET_USER_OFFLINE, (friendId: string) => {
        dispatch(removeOnlineFriend(friendId));
      });
      /* ===== socket events end ===== */
    } catch (error) {
      toast.error("Error while connecting");
      // if error in connection then clear all state for talk page
      talkPageCleanUp();
      navigate("/");
    }
  };

  const disconnectSocket = (): void => {
    // disconnect user from web socket server
    const socket = socketRef.current;
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
      socket.disconnect();
    }
    talkPageCleanUp();
  };

  return (
    <SocketContext.Provider value={{ socketRef, setupSocketConnection, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
