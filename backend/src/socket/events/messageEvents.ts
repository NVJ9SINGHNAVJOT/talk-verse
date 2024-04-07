import { Socket } from 'socket.io';

export const registerMessageEvents = (socket: Socket): void => {
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        // Handle message event
    });

    // Add more message-related event handlers here
};
