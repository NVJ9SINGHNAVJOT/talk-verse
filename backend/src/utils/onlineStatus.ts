import { Socket } from 'socket.io';
import User from "@/db/mongodb/models/User";
import { userSocketIDs } from "@/socket/index";
import { clientE } from '@/socket/events';
import { logger } from '@/logger/logger';

export const showOnline = async (userId: string, status: boolean, socket: Socket) => {
    try {
        const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();
        if (userData?.friends.length === undefined || userData?.friends.length < 1) {
            return;
        }

        const onlineFriends: string[] = [];
        userData?.friends.forEach((friend) => {
            const friendId: string = friend.friendId._id.toString();
            if (friendId && userSocketIDs.has(friendId)) {
                const socketIds = userSocketIDs.get(friendId);
                if (socketIds) {
                    onlineFriends.push(socketIds);
                }
            }
        });

        if (onlineFriends.length > 0) {
            if (status) {
                socket.to(onlineFriends).emit(clientE.SET_USER_ONLINE, userId);
                return;
            }
            socket.to(onlineFriends).emit(clientE.SET_USER_OFFLINE, userId);
        }

    } catch (error) {
        logger.error('errow while setting user online for friends', { error: error });
    }
};