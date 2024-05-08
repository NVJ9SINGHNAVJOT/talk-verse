import { Socket } from 'socket.io';
import User from "@/db/mongodb/models/User";
import { userSocketIDs } from "@/socket/index";
import { clientE } from '@/socket/events';
import { logger } from '@/logger/logger';

export const showOnline = async (userId: string, status: boolean, socket: Socket) => {
    try {
        const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();
        const onlineFriends: string[] = [];
        userData?.friends.forEach((friend) => {
            if (userSocketIDs.has(friend.friendId._id as string)) {
                onlineFriends.push(friend.friendId._id as string);
            }
        });

        if (status && onlineFriends.length > 0) {
            socket.to(onlineFriends).emit(clientE.SET_USER_OFFLINE, userId);
        }
        else {
            socket.to(onlineFriends).emit(clientE.SET_USER_ONLINE, userId);
        }

    } catch (error) {
        logger.error('errow while setting user online for friends', { error: error });
    }
};