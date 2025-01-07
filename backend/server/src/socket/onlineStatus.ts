/* eslint-disable drizzle/enforce-delete-with-where */
import { Server, Socket } from "socket.io";
import User from "@/db/mongodb/models/User";
import { groupOffline } from "@/socket/index";
import { clientE } from "@/socket/events";
import { logger } from "@/logger/logger";
import { getSingleUserSockets } from "@/socket/getSocketIds";
import Group from "@/db/mongodb/models/Group";

export const showOnline = async (
  io: Server,
  userId: string,
  newUserJoining: boolean,
  status: boolean,
  socket: Socket
) => {
  try {
    /* 
      Retrieve and join group rooms where the userId is a member,
      collecting the group room IDs in which the user is present.
    */
    const groupRooms: string[] = [];
    // If the user is joining, add their socketId to all associated group rooms.

    const groups = await Group.find({ members: { $elemMatch: { $eq: userId } } })
      .select({ _id: true })
      .exec();

    if (groups.length > 0) {
      // User exists in one or more groups, add groupIds to groupRooms.
      groups.forEach((group) => {
        if (status) {
          groupRooms.push(group.id); // Add group ID if the user is online.
        }

        if (newUserJoining || !status) {
          const offlineMembersOfGroupId = groupOffline.get(group.id); // Get the set of offline members for this group.
          if (!offlineMembersOfGroupId) {
            logger.error("No offline group present in groupOffline", { userId: userId, groupId: group.id });
            return; // Exit if there are no offline members to update.
          }

          // If a new user is joining, remove their userId from the offline group set.
          if (newUserJoining) {
            const check = offlineMembersOfGroupId.delete(userId); // Attempt to remove the userId.
            if (!check) {
              logger.error("userId is not present in offline set", { userId: userId, groupId: group.id });
            }
          } else {
            // If the user is disconnected, add their userId to the offline group set.
            offlineMembersOfGroupId.add(userId);
          }
        }
      });

      if (status) {
        // If the user is online, join all relevant group rooms.
        io.in(socket.id).socketsJoin(groupRooms);
      }
    }

    /* 
      Handle the case where the user is joining for the first time or getting disconnected.
    */
    if (newUserJoining || !status) {
      // Retrieve the user's friend list.
      const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();

      if (userData === null) {
        logger.error("userData is null", { id: userId });
        return; // Exit if user data cannot be found.
      }

      if (userData.friends.length === 0) {
        return; // Exit if the user has no friends to notify.
      }

      // Collect online friends' socket IDs.
      const onlineFriends: string[][] = [];
      userData.friends.forEach((friend) => {
        const friendSocketIds = getSingleUserSockets(friend.friendId._id.toString());
        if (friendSocketIds.length > 0) {
          onlineFriends.push(friendSocketIds); // Add online friend's socket IDs to the list.
        }
      });

      const allSocketIdsOfFriends = onlineFriends.flat(); // Flatten the array of socket IDs.

      if (allSocketIdsOfFriends.length === 0) {
        return; // Exit if no online friends are found.
      }

      // If the new user is joining, emit an event to inform friends of the user's online status.
      if (newUserJoining) {
        socket.to(allSocketIdsOfFriends).emit(clientE.SET_USER_ONLINE, userId);
      } else {
        // If the user is getting disconnected, emit an event to inform friends of the user's offline status.
        socket.to(allSocketIdsOfFriends).emit(clientE.SET_USER_OFFLINE, userId);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Error while setting user status", { error: error.message });
  }
};
