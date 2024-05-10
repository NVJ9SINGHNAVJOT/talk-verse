import { Socket } from "socket.io-client";
import { serverE } from "@/socket/events";
import { SoSendMessage } from "@/types/socket/eventTypes";

export const sendMessageEvent = (socket: Socket, chatId: string, to: string, text: string) => {
    const newMessage: SoSendMessage = {
        chatId: chatId,
        to: to,
        text: text
    };
    socket.emit(serverE.SEND_MESSAGE, newMessage);
};