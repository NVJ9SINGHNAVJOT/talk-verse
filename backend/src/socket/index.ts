import { Socket, Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerUserEvents } from '@/socket/events/userEvents';
import { checkUserSocket } from '@/middlewares/socket';
import { CustomSocket } from '@/types/custom';
import corsOptions from '@/config/corsOptions';

const userSocketIDs = new Map();
const onlineChats = new Set();
const onlineGroups = new Set();

export const setupSocketIO = (app: Application): HTTPServer => {
    const httpServer: HTTPServer = createServer(app);
    const io: Server = new Server(httpServer, {
        cors: corsOptions
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

    io.on('connection', (socket: Socket) => {
        const userId = (socket as CustomSocket).userId;
        if (!userId) {
            socket.disconnect();
        }
        console.log("a user connected id: ", socket.id, ": ", userId);
        userSocketIDs.set(userId, socket.id);

        registerMessageEvents(socket);
        registerUserEvents(socket);

        socket.on('disconnect', () => {
            console.log("a user disconnected id: ", socket.id, ": ", userId);
            // eslint-disable-next-line drizzle/enforce-delete-with-where
            userSocketIDs.delete(userId);
        });
    });

    return httpServer;
};
