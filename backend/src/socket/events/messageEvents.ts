import { Socket } from 'socket.io';
import { clientE, serverE } from '@/socket/events';
import { getSingleSocket } from '@/utils/getSocketIds';

export const registerMessageEvents = (socket: Socket, userId: string): void => {
    socket.on(serverE.SEND_MESSAGE, async (chatId: string, to: string, text: string) => {
        // Execute the bulk operations
        const sId = getSingleSocket(to)
        if (sId) {
            socket.to(sId).emit(clientE.MESSAGE_RECIEVED, chatId, userId, text);
            console.log('send message', chatId, to, text);
        }
    });
    socket.on(serverE.SEND_GROUP_MESSAGE, async (to: string, text: string, members: string[]) => {
        // Execute the bulk operations
        console.log('send group message', to, text, members);
    });
};
