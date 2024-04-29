import User from "@/db/mongodb/models/User";
import { Socket } from "socket.io";
import { configDotenv } from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import Token from "@/db/mongodb/models/Token";
import jwt from "jsonwebtoken";
import { CustomPayload, CustomSocket } from "@/types/custom";
configDotenv();

// check authentication for socket
export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
    try {
        const api_key = socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!api_key || api_key !== process.env.SERVER1_KEY) {
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

        // check token exist in database or expired or invalid token
        const checkToken = await Token.find({ tokenValue: token }).exec();
        if (checkToken.length !== 1) {
            return false;
        }

        // decode token
        const decoded: CustomPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded.userId) {
            return false;
        }

        // check user again with decode token data (decoded data contain userid)
        const checkUser = await User.find({ _id: decoded.userId }).exec();
        if (checkUser.length !== 1) {
            return false;
        }


        // user verified and now userid is set in request
        (socket as CustomSocket).userId = decoded.userId;

        return true;

    } catch (error) {
        return false;
    }
};