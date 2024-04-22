import User from "@/db/mongodb/models/User";
import { Socket } from "socket.io";
import { configDotenv } from "dotenv";
configDotenv();

export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
    try {
        const userId = socket.handshake.headers.authorization?.replace("Bearer ", "");
        const apiKey = socket.handshake.headers.Api_Key;

        const checkUser = await User.findById(userId);

        if (!checkUser && apiKey === process.env.SERVER1_KEY) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        return false;
    }
};