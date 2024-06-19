import { userSocketIDs } from "@/socket";

export const getSingleSocket = (userId: string): string[] => {
  const socketIds = userSocketIDs.get(userId);
  if (socketIds && socketIds.length > 0) {
    return socketIds;
  }
  return [];
};

export type Members = {
  // online contains socketIds only
  online: string[];
  // offline contains userIds only
  offline: string[];
};

export const getMultiSockets = (users: string[], currUserId?: string): Members => {
  const online: string[][] = [];
  const offline: string[] = [];

  if (currUserId) {
    users.forEach((user) => {
      if (user !== currUserId) {
        const socketIds = userSocketIDs.get(user);
        if (socketIds !== undefined) {
          online.push(socketIds);
        } else {
          offline.push(user);
        }
      }
    });
  } else {
    users.forEach((user) => {
      const socketId = userSocketIDs.get(user);
      if (socketId !== undefined) {
        online.push(socketId);
      } else {
        offline.push(user);
      }
    });
  }

  const membersData: Members = {
    // in online array it contains socketIds array of a user, so flat it for return
    online: online.flat(),
    offline: offline,
  };
  return membersData;
};
