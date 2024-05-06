import { useDispatch } from "react-redux";
import { clientE } from "@/socket/events";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import {
    addChatBarData,
    addFriend,
    addOnlineFriend,
    addUserRequest,
    addUserTyping,
    ChatBarData,
    Friend,
    removeOnlineFriend,
    removeUserTyping,
    UserRequest,
} from "@/redux/slices/chatSlice";

// Custom hook to manage socket event listeners
const useSocketEvents = (socket: Socket): void => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on(
            clientE.USER_REQUEST,
            (userId: string, userName: string, imageUrl?: string) => {
                dispatch(
                    addUserRequest({
                        _id: userId,
                        userName: userName,
                        imageUrl: imageUrl ? imageUrl : "",
                    } as UserRequest)
                );
            }
        );

        socket.on(
            clientE.REQUEST_ACCEPTED,
            (
                newFriendId: string,
                chatId: string,
                firstName: string,
                lastName: string,
                imageUrl?: string
            ) => {
                dispatch(
                    addFriend({
                        _id: newFriendId,
                        chatId: chatId,
                        firstName: firstName,
                        lastName: lastName,
                        imageUrl: imageUrl ? imageUrl : "",
                    } as Friend)
                );

                dispatch(
                    addChatBarData({
                        _id: newFriendId,
                        firstName: firstName,
                        lastName: lastName,
                        imageUrl: imageUrl ? imageUrl : "",
                        chatId: chatId,
                    } as ChatBarData)
                );
            }
        );

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
