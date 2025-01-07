import { Socket } from "socket.io";
import { clientE, serverE } from "@/socket/events";
import { getSingleUserSockets } from "@/socket/getSocketIds";
import { logger } from "@/logger/logger";

export const registerNotificationEvents = (socket: Socket, userId: string): void => {
  socket.on(serverE.START_TYPING, (friendId: string) => {
    try {
      const friendSocketIds = getSingleUserSockets(friendId);
      if (friendSocketIds.length > 0) {
        socket.to(friendSocketIds).emit(clientE.OTHER_START_TYPING, userId);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("error while emitting socket event for user typing", { error: error.message });
    }
  });

  socket.on(serverE.STOP_TYPING, (friendId: string) => {
    try {
      const friendSocketIds = getSingleUserSockets(friendId);
      if (friendSocketIds.length > 0) {
        socket.to(friendSocketIds).emit(clientE.OTHER_STOP_TYPING, userId);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("error while emitting socket event for user stop typing", { error: error.message });
    }
  });
};
