import { Socket } from 'socket.io';
import { se } from '@/socket/events';

export const registerMessageEvents = (socket: Socket): void => {
    socket.on(se.SEND_MESSAGE, async (chatId: string, from: string, to: string, text: string) => {
        // Execute the bulk operations
    });
};
