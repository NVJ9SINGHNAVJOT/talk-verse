import { Socket } from "socket.io";
import { configDotenv } from "dotenv";
import { CustomSocket } from "@/types/custom";
import { jwtVerify } from "@/utils/token";
import { logger } from "@/logger/logger";
configDotenv();

// check authentication for socket
export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
    try {
        logger.info('socket req details', { socketId: socket.id, method: socket.request.method, url: socket.request.url, headers: socket.request.headers });

        const serverKey = socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!serverKey || serverKey !== process.env.SERVER_KEY) {
            return false;
        }

        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
            return false;
        }

        const splitCookies = rawCookies?.split('; ');
        const parsedCookies: Record<string, string> = {};

        splitCookies.forEach((cookie) => {
            const parts = cookie.split('=');
            if (parts[0] && parts[1]) {
                parsedCookies[parts[0]] = parts[1];
            }
        });

        // Extract the token value
        const token = parsedCookies[process.env.TOKEN_NAME as string];

        if (!token) {
            return false;
        }

        const userId = await jwtVerify(token);

        if (!userId) {
            return false;
        }

        // user verified and now userid is set in request
        (socket as CustomSocket).userId = userId;

        return true;

    } catch (error) {
        return false;
    }
};