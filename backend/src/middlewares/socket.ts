import { Socket } from "socket.io";
import { configDotenv } from "dotenv";
import { CustomSocket } from "@/types/custom";
import { jwtVerify } from "@/utils/token";
configDotenv();

// check authentication for socket
export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
    try {
        const api_key = socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!api_key || api_key !== process.env.SERVER_KEY) {
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