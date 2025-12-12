import {
  addChatBarData,
  addFriend,
  addOnlineFriend,
  addUserRequest,
  addUserTyping,
  chatSliceObject,
  type Friend,
  removeOnlineFriend,
  removeUserTyping,
  resetTyping,
  setChatBarData,
  setFriends,
  setOnlineFriend,
  setUserRequests,
  type UserRequest,
} from "@/redux/slices/chatSlice";
import {
  addLiveGpMessageAsync,
  addLivePMessageAsync,
  addNewUnseen,
  type GroupMessage,
  messagesSliceObject,
  resetGpMess,
  resetPMess,
  setUnseenMessages,
} from "@/redux/slices/messagesSlice";
import { loadingSliceObject, setTalkPageLoading } from "@/redux/slices/loadingSlice";
import { chatBarDataApi } from "@/services/operations/chatApi";
import { checkOnlineFriendsApi, getAllNotificationsApi } from "@/services/operations/notificationApi";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { clientE } from "@/socket/events";
import {
  type SoUserRequest,
  type SoRequestAccepted,
  type SoAddedInGroup,
  type SoMessageRecieved,
  type SoGroupMessageRecieved,
} from "@/types/socket/eventTypes";
import { useAppDispatch } from "@/redux/store";

interface SocketContextInterface {
  socketRef: React.MutableRefObject<Socket>;
  setupSocketConnection: () => Promise<void>;
  disconnectSocket: () => void;
}

type ContextProviderProps = {
  children: ReactNode;
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
  // connectionInitiated is a flag for when connection is initiated
  // by talk page after private key validation
  let connectionInitiated = true;

  const socketInstance = io(process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER as string, {
    withCredentials: true,
    autoConnect: false,
    extraHeaders: {
      // serverKey for access
      Authorization: process.env.SERVER_KEY as string,
    },
  });
  const socketRef = useRef<Socket>(socketInstance);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      if (socketRef.current.connected === false) {
        socketRef.current.connect();
      } else {
        return;
      }

      /* 
        user is connected with web socket server then register socket events
        all event listeners are registered here 
      */

      socketRef.current.on("connect_error", () => {
        if (connectionInitiated === true) {
          toast.error("Error in connection");
          // if error in connection then clear all state for talk page
          talkPageCleanUp();
          navigate("/");
          connectionInitiated = false;
        }
      });

      socketRef.current.on("connect", () => {
        connectionInitiated = true;
        setTimeout(() => {
          dispatch(setTalkPageLoading(false));
        }, 500);
      });

      /* ===== socket events start ===== */
      socketRef.current.on(clientE.USER_REQUEST, (data: SoUserRequest) => {
        dispatch(
          addUserRequest({
            _id: data._id,
            userName: data.userName,
            imageUrl: data.imageUrl,
          } satisfies UserRequest as UserRequest)
        );
        toast.info("New friend request");
      });

      socketRef.current.on(clientE.REQUEST_ACCEPTED, (data: SoRequestAccepted) => {
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

      socketRef.current.on(clientE.ADDED_IN_GROUP, (data: SoAddedInGroup) => {
        dispatch(addNewUnseen(data._id));
        dispatch(addChatBarData(data));
        toast.success("Added in new Group");
      });

      socketRef.current.on(clientE.MESSAGE_RECIEVED, (data: SoMessageRecieved) => {
        dispatch(addLivePMessageAsync(data));
      });

      socketRef.current.on(clientE.GROUP_MESSAGE_RECIEVED, (data: SoGroupMessageRecieved) => {
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
        dispatch(addLiveGpMessageAsync(newGpMessage));
      });

      socketRef.current.on(clientE.OTHER_START_TYPING, (friendId: string) => {
        dispatch(addUserTyping(friendId));
      });

      socketRef.current.on(clientE.OTHER_STOP_TYPING, (friendId: string) => {
        dispatch(removeUserTyping(friendId));
      });

      socketRef.current.on(clientE.SET_USER_ONLINE, (friendId: string) => {
        dispatch(addOnlineFriend(friendId));
      });

      socketRef.current.on(clientE.SET_USER_OFFLINE, (friendId: string) => {
        dispatch(removeOnlineFriend(friendId));
      });
      /* ===== socket events end ===== */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error while connecting");
      // if error in connection then clear all state for talk page
      talkPageCleanUp();
      navigate("/");
    }
  };

  const disconnectSocket = (): void => {
    // disconnect user from web socket server

    if (socketRef.current) {
      socketRef.current.off(clientE.USER_REQUEST);
      socketRef.current.off(clientE.REQUEST_ACCEPTED);
      socketRef.current.off(clientE.ADDED_IN_GROUP);
      socketRef.current.off(clientE.GROUP_MESSAGE_RECIEVED);
      socketRef.current.off(clientE.MESSAGE_RECIEVED);
      socketRef.current.off(clientE.OTHER_START_TYPING);
      socketRef.current.off(clientE.OTHER_STOP_TYPING);
      socketRef.current.off(clientE.SET_USER_ONLINE);
      socketRef.current.off(clientE.SET_USER_OFFLINE);
      socketRef.current.disconnect();
    }
    talkPageCleanUp();
  };

  return (
    <SocketContext.Provider value={{ socketRef, setupSocketConnection, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
