import User from "@/db/mongodb/models/User";
import { Socket } from "socket.io";
import { configDotenv } from "dotenv";
configDotenv();

export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
    try {
        const userId = socket.handshake.headers.authorization?.replace("Bearer ", "");
        const api_key = socket.handshake.headers.api_key;

        const checkUser = await User.findById(userId);

        if (checkUser && api_key === process.env.SERVER1_KEY) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        return false;
    }
};