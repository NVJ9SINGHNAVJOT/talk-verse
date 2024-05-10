import { Socket } from "socket.io-client";
import { serverE } from "@/socket/events";

export const startTypingEvent = (socket: Socket, friendId: string) => {
    socket.emit(serverE.START_TYPING, friendId);
};

export const stopTypingEvent = (socket: Socket, friendId: string) => {
    socket.emit(serverE.STOP_TYPING, friendId);
};