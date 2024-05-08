import { useDispatch } from "react-redux";
import { clientE } from "@/socket/events";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import {
    addChatBarData,
    addFriend,
    addGroup,
    addNewUnseen,
    addOnlineFriend,
    addUserRequest,
    addUserTyping,
    removeOnlineFriend,
    removeUserTyping,
    UserRequest,
} from "@/redux/slices/chatSlice";
import { toast } from "react-toastify";
import { SoAddedInGroup, SoGroupMessageRecieved, SoMessageRecieved, SoRequestAccepted, SoUserRequest } from "@/types/socket/eventTypes";
import { addGpMessages, addPMessages, GroupMessages } from "@/redux/slices/messagesSlice";

// Custom hook to manage socket event listeners
const useSocketEvents = (socket: Socket): void => {
    const dispatch = useDispatch();

    useEffect(() => {

        socket.on(
            clientE.USER_REQUEST,
            (data: SoUserRequest) => {
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
                data: SoRequestAccepted
            ) => {
                dispatch(
                    addFriend({
                        _id: data._id,
                        chatId: data.chatId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        imageUrl: data.imageUrl
                    })
                );

                dispatch(
                    addChatBarData({
                        _id: data._id,
                        chatId: data.chatId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        imageUrl: data.imageUrl,
                    })
                );

                dispatch(addNewUnseen(data.chatId));

                toast.success('New friend added');
            }
        );

        socket.on(clientE.ADDED_IN_GROUP, (data: SoAddedInGroup) => {
            dispatch(addGroup({
                _id: data._id,
                groupName: data.groupName,
                gpImageUrl: data.gpImageUrl
            }));
            dispatch(addChatBarData({
                _id: data._id,
                groupName: data.groupName,
                gpImageUrl: data.gpImageUrl
            }));
        });

        socket.on(clientE.GROUP_MESSAGE_RECIEVED, (data: SoGroupMessageRecieved) => {
            const newGpMessage: GroupMessages = {
                uuId: data.uuId,
                isFile: data.isFile,
                from: {
                    _id: data.from,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    imageUrl: data.imageUrl
                },
                text: data.text,
                createdAt: data.createdAt
            };
            dispatch(addGpMessages([newGpMessage]));
        });

        socket.on(clientE.MESSAGE_RECIEVED, (data: SoMessageRecieved) => {
            dispatch(addPMessages([data]));
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
            socket.off(clientE.ADDED_IN_GROUP);
            socket.off(clientE.GROUP_MESSAGE_RECIEVED);
            socket.off(clientE.MESSAGE_RECIEVED);
            socket.off(clientE.OTHER_START_TYPING);
            socket.off(clientE.OTHER_STOP_TYPING);
            socket.off(clientE.SET_USER_ONLINE);
            socket.off(clientE.SET_USER_OFFLINE);
        };

    }, []);
};

export default useSocketEvents;
