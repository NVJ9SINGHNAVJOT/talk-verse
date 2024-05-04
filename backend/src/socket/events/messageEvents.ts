import { Socket } from 'socket.io';
import { serverE } from '@/socket/events';

export const registerMessageEvents = (socket: Socket): void => {
    socket.on(serverE.SEND_MESSAGE, async (chatId: string, from: string, to: string, text: string) => {
        // Execute the bulk operations
        console.log('send message', chatId, from, to, text);
    });
};
