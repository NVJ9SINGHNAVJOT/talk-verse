/* eslint-disable drizzle/enforce-delete-with-where */
import { Socket, Server } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { Application } from "express";
import { registerMessageEvents } from "@/socket/events/messageEvents";
import { registerNotificationEvents } from "@/socket/events/notificationEvents";
import { checkUserSocket } from "@/middlewares/socket";
import { CustomSocket } from "@/types/custom";
import Channel from "@/types/channel";
import { showOnline } from "@/socket/onlineStatus";
import { logger } from "@/logger/logger";
import { origins } from "@/config/corsOptions";

/*
  NOTE: Currently, userSocketIDs, groupOffline, and channels mapping is stored in the server.
  For scalability, consider using Redis for persistent storage.
*/

/* 
  Store userIds with their current socketIds in a Map.
  Key: userId -> Value: socketIds[] (a user can join from multiple devices)
*/
export const userSocketIDs = new Map<string, string[]>();

/*
  Store offline members for each group in a Map.
  Key: groupId -> Value: Set of offline members
*/
export const groupOffline = new Map<string, Set<string>>();

/*
  Create a map to store channels for mainID.
  Key: chatId/_id  (chatId is for two users, and _id is for groups)
*/
export const channels: Map<string, Channel> = new Map();

// WebSocket instance for emitting events from the API server
export let _io: Server;

/*
  Set up the WebSocket server with Express application and return the HTTP server instance.
  The server supports CORS configuration for cross-origin requests.
*/
export const setupWebSocket = (app: Application): HTTPServer => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: origins, // Allowed origins for CORS
      credentials: true, // Allow credentials
      methods: ["PUT", "PATCH", "POST", "GET", "DELETE"], // Allowed HTTP methods
    },
  });

  _io = io; // Store the WebSocket instance

  // Socket authorization middleware
  io.use(async (socket: Socket, next) => {
    if ((await checkUserSocket(socket)) === true) {
      next(); // Proceed if user is authorized
    } else {
      logger.error("socket authorization failed", { socketId: socket.id });
      next(new Error("authorization invalid, access denied")); // Deny access
    }
  });

  // Handle new connections
  io.on("connection", (socket: Socket) => {
    const userId = (socket as CustomSocket).userId; // Get userId from the socket
    logger.info(`a user connected id: ${userId} : ${socket.id}`);

    // Check if the user is already connected
    const checkUserAlreadyConnected = userSocketIDs.get(userId);
    if (checkUserAlreadyConnected === undefined) {
      // New user is connected
      userSocketIDs.set(userId, [socket.id]);
      showOnline(io, userId, true, true, socket); // Notify online status
    } else {
      // Existing user is reconnecting
      checkUserAlreadyConnected.push(socket.id);
      showOnline(io, userId, false, true, socket); // Update online status
    }

    /* Register socket events for notifications and messages */
    registerNotificationEvents(socket, userId);
    registerMessageEvents(io, socket, userId);

    // Handle user disconnection
    socket.on("disconnect", () => {
      logger.info(`a user disconnected id: ${userId} : ${socket.id}`);

      // Remove userId from userSocketIDs
      const checkUserAlreadyConnected = userSocketIDs.get(userId);
      if (!checkUserAlreadyConnected || checkUserAlreadyConnected.length === 0) {
        logger.error("while disconnecting no socketId array is present in userSocketIDs map");
        showOnline(io, userId, false, false, socket); // Notify offline status
        return;
      }

      // Check if this is the only socketId present for the userId
      if (checkUserAlreadyConnected.length === 1) {
        userSocketIDs.delete(userId); // Remove the user from the map
        showOnline(io, userId, false, false, socket); // Notify offline status
      } else {
        // User is still connected with other socketIds
        const afterRemovingSocketId = checkUserAlreadyConnected.filter((sId) => sId !== socket.id);
        userSocketIDs.set(userId, afterRemovingSocketId); // Update the list of socketIds
      }
    });
  });

  return httpServer; // Return the HTTP server instance
};
