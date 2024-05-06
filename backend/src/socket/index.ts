import { Socket, Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerNotificationEvents } from '@/socket/events/notificationEvents';
import { checkUserSocket } from '@/middlewares/socket';
import { CustomSocket } from '@/types/custom';
import corsOptions from '@/config/corsOptions';
import Mutex from '@/types/mutex';
import { showOnline } from '@/socket/onlineStatus';

// store userIds with their current socketIds
export const userSocketIDs = new Map<string, string>();

// create a map to store mutexes
export const chatLocks: Map<string, Mutex> = new Map();


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
        console.log("a user connected id: ", userId, ": ", socket.id);
        userSocketIDs.set(userId, socket.id);
        showOnline(userId, true, socket);

        registerMessageEvents(socket, userId);
        registerNotificationEvents(socket, userId);

        socket.on('disconnect', () => {
            console.log("a user disconnected id: ", userId, ": ", socket.id);
            // eslint-disable-next-line drizzle/enforce-delete-with-where
            userSocketIDs.delete(userId);
            showOnline(userId, false, socket);
        });
    });

    return httpServer;
};
