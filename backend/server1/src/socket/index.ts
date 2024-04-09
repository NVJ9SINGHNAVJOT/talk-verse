import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerUserEvents } from '@/socket/events/userEvents';

export const setupSocketIO = (app: Application): HTTPServer => {
    const httpServer: HTTPServer = createServer(app);
    const io: SocketIOServer = new SocketIOServer(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        registerMessageEvents(socket);
        registerUserEvents(socket);
        // Register other event categories as needed
    });

    return httpServer;
};
