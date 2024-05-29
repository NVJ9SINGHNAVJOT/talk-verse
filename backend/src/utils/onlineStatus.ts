/* eslint-disable drizzle/enforce-delete-with-where */
import { Server, Socket } from 'socket.io';
import User from "@/db/mongodb/models/User";
import { groupIds, groupOffline, userSocketIDs } from "@/socket/index";
import { clientE } from '@/socket/events';
import { logger } from '@/logger/logger';

export const showOnline = async (io: Server, userId: string, status: boolean, socket: Socket) => {
    try {
        // join group rooms in which userId is present

        const groupRooms: string[] = [];
        groupIds.forEach((groupMem, groupId) => {
            if (groupMem.includes(userId)) {
                groupRooms.push(groupId);
                const offlineMembersOfgroupId = groupOffline.get(groupId);
                if (offlineMembersOfgroupId) {
                    if (status) {
                        // eslint-disable-next-line drizzle/enforce-delete-with-where
                        const check = offlineMembersOfgroupId.delete(userId);
                        if (!check) {
                            logger.error("userId is not present in offline set", { userId: userId, groupId: groupId });
                        }
                    }
                    else {
                        offlineMembersOfgroupId.add(userId);
                    }
                }
                else {
                    logger.error("no offline set present for groupId");
                }
            }
        });

        if (status) {
            io.in(socket.id).socketsJoin(groupRooms);
        }

        const userData = await User.findById({ id: userId }).select({ friends: true }).exec();
        if (userData?.friends.length === undefined || userData?.friends.length < 1) {
            return;
        }

        const onlineFriends: string[] = [];
        userData?.friends.forEach((friend) => {
            const friendId: string = friend.friendId.id;
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