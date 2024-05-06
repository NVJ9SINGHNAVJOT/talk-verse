import { Socket } from 'socket.io';
import { clientE, serverE } from '../events';
import { userSocketIDs } from '..';

export const registerNotificationEvents = (socket: Socket, userId: string): void => {
  socket.on(serverE.START_TYPING, (friendId: string) => {
    if (userSocketIDs.has(friendId)) {
      socket.to(userSocketIDs.get(friendId)).emit(clientE.OTHER_START_TYPING, userId);
    }
  });

  socket.on(serverE.STOP_TYPING, (friendId: string) => {
    if (userSocketIDs.has(friendId)) {
      socket.to(userSocketIDs.get(friendId)).emit(clientE.OTHER_STOP_TYPING, userId);
    }
  });
};
