import { Socket } from "socket.io-client";
import { serverE } from "@/socket/events";
import { SoSendGroupMessage, SoSendMessage } from "@/types/socket/eventTypes";

export const sendMessageEvent = (socket: Socket, chatId: string, to: string, text: string) => {
    const newMessage: SoSendMessage = {
        chatId: chatId,
        to: to,
        text: text
    };
    socket.emit(serverE.SEND_MESSAGE, newMessage);
};

export const sendGroupMessageEvent = (socket: Socket, groupId: string, text: string, firstName: string, lastName: string, imageUrl?: string) => {
    const newGpMessage: SoSendGroupMessage = {
        _id: groupId,
        firstName: firstName,
        lastName: lastName,
        text: text,
        imageUrl: imageUrl
    };
    socket.emit(serverE.SEND_GROUP_MESSAGE, newGpMessage);
};