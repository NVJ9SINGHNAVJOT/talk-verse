/* eslint-disable drizzle/enforce-delete-with-where */
import { Server, Socket } from "socket.io";
import User from "@/db/mongodb/models/User";
import { groupIds, groupOffline, userSocketIDs } from "@/socket/index";
import { clientE } from "@/socket/events";
import { logger } from "@/logger/logger";

export const showOnline = async (
  io: Server,
  userId: string,
  newUserJoinng: boolean,
  status: boolean,
  socket: Socket
) => {
  try {
    /* 
      join group rooms in which userId is present
      get group room Ids in which user is present
    */
    const groupRooms: string[] = [];

    groupIds.forEach((groupMem, groupId) => {
      // user exist in group, push groupId in groupRooms
      if (groupMem.includes(userId)) {
        groupRooms.push(groupId);

        const offlineMembersOfgroupId = groupOffline.get(groupId);

        // if new user is joined, then remove it's userId from offline groups
        if (newUserJoinng && offlineMembersOfgroupId) {
          const check = offlineMembersOfgroupId.delete(userId);
          if (!check) {
            logger.error("userId is not present in offline set", { userId: userId, groupId: groupId });
          }
        }

        // user got disconnected, add user in offline groupIds
        if (!status && offlineMembersOfgroupId) {
          offlineMembersOfgroupId.add(userId);
        }
      }
    });

    // if user is joining then join socketId to all group rooms
    if (status && groupRooms.length > 0) {
      io.in(socket.id).socketsJoin(groupRooms);
    }

    /* 
      if user is joining first time or user is getting disconnected
    */
    if (newUserJoinng || !status) {
      // get user friends
      const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();
      if (userData?.friends.length === undefined || userData?.friends.length === 0) {
        return;
      }

      // get online friends
      const onlineFriends: string[] = [];
      userData?.friends.forEach((friend) => {
        const friendId = friend.friendId._id.toString();
        if (userSocketIDs.has(friendId)) {
          const socketIds = userSocketIDs.get(friendId);
          if (socketIds && socketIds.length > 0) {
            // push all socketIds of friend in onlineFriens
            for (let index = 0; index < socketIds.length; index++) {
              const sId = socketIds[index];
              if (sId) {
                onlineFriends.push(sId);
              }
            }
          }
        }
      });

      if (onlineFriends.length > 0) {
        // if new user is joining
        if (newUserJoinng) {
          socket.to(onlineFriends).emit(clientE.SET_USER_ONLINE, userId);
        }
        // user is getting disconnected
        socket.to(onlineFriends).emit(clientE.SET_USER_OFFLINE, userId);
      }
    }
  } catch (error) {
    logger.error("errow while setting user status for online friends", { error: error });
  }
};
