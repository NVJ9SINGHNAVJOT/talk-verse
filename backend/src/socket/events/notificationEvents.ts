import { Socket } from "socket.io";
import { clientE, serverE } from "@/socket/events";
import { getSingleSocket } from "@/utils/getSocketIds";
import { logger } from "@/logger/logger";

export const registerNotificationEvents = (socket: Socket, userId: string): void => {
  socket.on(serverE.START_TYPING, (friendId: string) => {
    try {
      const sId = getSingleSocket(friendId);
      if (sId) {
        socket.to(sId).emit(clientE.OTHER_START_TYPING, userId);
      }
    } catch (error) {
      logger.error("error while emitting socket event for user typing", { error: error });
    }
  });

  socket.on(serverE.STOP_TYPING, (friendId: string) => {
    try {
      const sId = getSingleSocket(friendId);
      if (sId) {
        socket.to(sId).emit(clientE.OTHER_STOP_TYPING, userId);
      }
    } catch (error) {
      logger.error("error while emitting socket event for user stop typing", { error: error });
    }
  });
};
