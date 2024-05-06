import { Socket } from 'socket.io';
import { clientE, serverE } from '../events';
import { getSingleSocket } from '@/utils/getSocketIds';

export const registerNotificationEvents = (socket: Socket, userId: string): void => {
  socket.on(serverE.START_TYPING, (friendId: string) => {
    const sId = getSingleSocket(friendId);
    if (sId) {
      socket.to(sId).emit(clientE.OTHER_START_TYPING, userId);
    }
  });

  socket.on(serverE.STOP_TYPING, (friendId: string) => {
    const sId = getSingleSocket(friendId);
    if (sId) {
      socket.to(sId).emit(clientE.OTHER_STOP_TYPING, userId);
    }
  });
};
