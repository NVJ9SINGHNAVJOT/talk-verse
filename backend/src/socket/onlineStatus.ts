import { Socket } from 'socket.io';
import User from "@/db/mongodb/models/User";
import { userSocketIDs } from "@/socket/index";
import { clientE } from './events';

export const showOnline = async (userId: string, status: boolean, socket: Socket) => {

    const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();
    const onlineFriend: string[] = [];
    userData?.friends.forEach((friend) => {
        if (userSocketIDs.has(friend.friendId)) {
            onlineFriend.push(friend.friendId as unknown as string);
        }
    });

    if (status && onlineFriend.length > 0) {
        socket.to(onlineFriend).emit(clientE.SET_USER_OFFLINE, userId);
    }
    else {
        socket.to(onlineFriend).emit(clientE.SET_USER_ONLINE, userId);
    }
};