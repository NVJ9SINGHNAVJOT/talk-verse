import { Socket, Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { Application } from 'express';
import { registerMessageEvents } from '@/socket/events/messageEvents';
import { registerNotificationEvents } from '@/socket/events/notificationEvents';
import { checkUserSocket } from '@/middlewares/socket';
import { CustomSocket } from '@/types/custom';
import corsOptions from '@/config/corsOptions';
import Channel from '@/types/channel';
import { showOnline } from '@/utils/onlineStatus';
import { logger } from '@/logger/logger';

// store userIds with their current socketIds
// userId -> socketId
export const userSocketIDs = new Map<string, string>();

// store group members with groupId
// groupId -> members
export const groupIds = new Map<string, string[]>();

// offline members for each group
// groupId -> offline members
export const groupOffline = new Map<string, Set<string>>();

// create a map to store channels for mainID   chatId/id  ->   chatId is for two users and id is of group
export const channels: Map<string, Channel> = new Map();

export const setupWebSocket = (app: Application): HTTPServer => {
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
                logger.error('socket authorization failed', { socketId: socket.id });
                next(new Error("authorization invalid, access denied"));
            }
        } catch (error) {
            logger.error('socket authorization failed', { socketId: socket.id });
            next(new Error("error which checking user authenticaton for socket connection"));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = (socket as CustomSocket).userId;
        if (!userId) {
            socket.disconnect();
        }
        logger.info("a user connected id: ", userId, ": ", socket.id);
        // set userId in userSocketIds and show friends that user in online
        userSocketIDs.set(userId, socket.id);
        showOnline(io, userId, true, socket);

        // register events
        registerNotificationEvents(socket, userId);
        registerMessageEvents(io, socket, userId);

        socket.on('disconnect', () => {
            logger.info("a user disconnected id: ", userId, ": ", socket.id);
            // delete userId in userSocketIds and show friends that user if offline
            // eslint-disable-next-line drizzle/enforce-delete-with-where
            userSocketIDs.delete(userId);
            showOnline(io, userId, false, socket);
        });
    });

    return httpServer;
};
