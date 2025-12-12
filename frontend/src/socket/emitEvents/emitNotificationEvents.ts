import { Socket } from "socket.io-client";
import { serverE } from "@/socket/events";
import { toast } from "react-toastify";

export const startTypingEvent = (socket: Socket, friendId: string) => {
  try {
    socket.emit(serverE.START_TYPING, friendId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Error while sending typing notification");
  }
};

export const stopTypingEvent = (socket: Socket, friendId: string) => {
  try {
    socket.emit(serverE.STOP_TYPING, friendId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Error while sending typing notification");
  }
};
