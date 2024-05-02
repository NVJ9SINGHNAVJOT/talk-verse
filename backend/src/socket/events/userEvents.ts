import { Socket } from 'socket.io';

export const registerUserEvents = (socket: Socket): void => {
    socket.on('user:join', (user) => {
        console.log('user joined: ' + user);
        // Handle user join event
    });

    // Add more user-related event handlers here
};
