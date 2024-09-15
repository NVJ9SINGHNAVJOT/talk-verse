/* eslint-disable drizzle/enforce-delete-with-where */
import { Server, Socket } from "socket.io";
import User from "@/db/mongodb/models/User";
import { groupOffline } from "@/socket/index";
import { clientE } from "@/socket/events";
import { logger } from "@/logger/logger";
import { getSingleUserSockets } from "@/utils/getSocketIds";
import Group from "@/db/mongodb/models/Group";

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
    // if user is joining then join socketId to all group rooms

    const groups = await Group.find({ members: { $elemMatch: { $eq: userId } } })
      .select({ _id: true })
      .exec();

    if (groups.length > 0) {
      // user exist in group, push groupId in groupRooms
      groups.forEach((group) => {
        groupRooms.push(group.id);

        if (newUserJoinng || !status) {
          const offlineMembersOfgroupId = groupOffline.get(group.id);
          if (!offlineMembersOfgroupId) {
            logger.error("no offline group present in groupOffline", { userId: userId, groupId: group.id });
            return;
          }

          // if new user is joined, then remove it's userId from offline groups
          if (newUserJoinng) {
            const check = offlineMembersOfgroupId.delete(userId);
            if (!check) {
              logger.error("userId is not present in offline set", { userId: userId, groupId: group.id });
            }
          } else {
            // user got disconnected, add user in offline groupIds
            offlineMembersOfgroupId.add(userId);
          }
        }
      });
      // join all groups
      io.in(socket.id).socketsJoin(groupRooms);
    }

    /* 
      if user is joining first time or user is getting disconnected
    */
    if (newUserJoinng || !status) {
      // get user friends
      const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();

      if (userData === null) {
        logger.error("userData is null", { id: userId });
        return;
      }

      if (userData.friends.length === 0) {
        return;
      }

      // get online friends socketIds
      const onlineFriends: string[][] = [];
      userData.friends.forEach((friend) => {
        const friendSocketIds = getSingleUserSockets(friend.friendId._id.toString());
        if (friendSocketIds.length > 0) {
          onlineFriends.push(friendSocketIds);
        }
      });

      const allSocketIdsOfFriends = onlineFriends.flat();

      if (allSocketIdsOfFriends.length === 0) {
        return;
      }

      // if new user is joining
      if (newUserJoinng) {
        socket.to(allSocketIdsOfFriends).emit(clientE.SET_USER_ONLINE, userId);
      }

      // user is getting disconnected
      if (!status) {
        socket.to(allSocketIdsOfFriends).emit(clientE.SET_USER_OFFLINE, userId);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("errow while setting user status", { error: error.message });
  }
};
