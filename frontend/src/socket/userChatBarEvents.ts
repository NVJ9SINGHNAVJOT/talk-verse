import { useDispatch } from "react-redux";
import { clientE } from "@/socket/events";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import {
    addChatBarData,
    addFriend,
    addNewUnseen,
    addOnlineFriend,
    addUserRequest,
    addUserTyping,
    ChatBarData,
    Friend,
    removeOnlineFriend,
    removeUserTyping,
    UserRequest,
} from "@/redux/slices/chatSlice";
import { toast } from "react-toastify";
import { SGroupMessageRecieved, SRequestAccepted, SUserRequest } from "@/types/scoket/eventTypes";

// Custom hook to manage socket event listeners
const useSocketEvents = (socket: Socket): void => {
    const dispatch = useDispatch();

    useEffect(() => {

        socket.on(
            clientE.USER_REQUEST,
            (data: SUserRequest) => {
                dispatch(
                    addUserRequest({
                        _id: data._id,
                        userName: data.userName,
                        imageUrl: data.imageUrl,
                    } as UserRequest)
                );
                toast.info('New user request');
            }
        );

        socket.on(
            clientE.REQUEST_ACCEPTED,
            (
                data: SRequestAccepted
            ) => {
                dispatch(
                    addFriend({
                        _id: data._id,
                        chatId: data.chatId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        imageUrl: data.imageUrl
                    } as Friend)
                );

                dispatch(
                    addChatBarData({
                        _id: data._id,
                        chatId: data.chatId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        imageUrl: data.imageUrl ? data.imageUrl : "",
                    } as ChatBarData)
                );

                dispatch(addNewUnseen(data.chatId));

                toast.success('New friend added');
            }
        );

        socket.on(clientE.GROUP_MESSAGE_RECIEVED, (data: SGroupMessageRecieved)=>{
            console.log(data);
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

        return () => {
            socket.off(clientE.USER_REQUEST);
            socket.off(clientE.REQUEST_ACCEPTED);
            socket.off(clientE.OTHER_START_TYPING);
            socket.off(clientE.OTHER_STOP_TYPING);
            socket.off(clientE.SET_USER_ONLINE);
            socket.off(clientE.SET_USER_OFFLINE);
        };
    }, []);
};

export default useSocketEvents;
