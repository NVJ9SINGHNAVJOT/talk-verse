import { Socket } from 'socket.io';

export const registerNotificationEvents = (socket: Socket): void => {
    socket.on('user:join', (user) => {
        console.log('user joined: ' + user);
    });
};
