import { Socket, Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerNotificationEvents } from '@/socket/events/notificationEvents';
import { checkUserSocket } from '@/middlewares/socket';
import { CustomSocket } from '@/types/custom';
import corsOptions from '@/config/corsOptions';
import Mutex from '@/types/mutex';
import { showOnline } from '@/utils/onlineStatus';

// store userIds with their current socketIds
export const userSocketIDs = new Map<string, string>();
// store group members with groupId
export const groupIds = new Map<string, string[]>();

// create a map to store mutexes for mainID   chatId/_id  ->   chatId is for two users and _id is of group
export const channels: Map<string, Mutex> = new Map();

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
        // set userId in userSocketIds and show friends that user in online
        userSocketIDs.set(userId, socket.id);
        showOnline(userId, true, socket);

        // register events
        registerNotificationEvents(socket, userId);
        registerMessageEvents(io, socket, userId);

        socket.on('disconnect', () => {
            console.log("a user disconnected id: ", userId, ": ", socket.id);
            // delete userId in userSocketIds and show friends that user if offline
            // eslint-disable-next-line drizzle/enforce-delete-with-where
            userSocketIDs.delete(userId);
            showOnline(userId, false, socket);
        });
    });

    return httpServer;
};
