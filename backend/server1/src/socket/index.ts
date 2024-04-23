import { Socket, Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerUserEvents } from '@/socket/events/userEvents';
import { checkUserSocket } from '@/middlewares/socket';

export const setupSocketIO = (app: Application): HTTPServer => {
    const httpServer: HTTPServer = createServer(app);
    const io: Server = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ["PUT", "PATCH", "POST", "GET", "DELETE"]
        },
    });

    app.set("io", io);


    io.use(async (socket: Socket, next) => {
        try {
            if (await checkUserSocket(socket) === true) {
                next();
            }
            else {
                next(new Error("authorization invalid, access denied"));
            }
        } catch (error) {
            next(new Error("error which checking user authenticaton for socket connection"));
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected id:', socket.id);

        registerMessageEvents(socket);
        registerUserEvents(socket);

        socket.on('disconnect', () => {
            console.log("a user disconnected id:", socket.id);
        });
    });

    return httpServer;
};
