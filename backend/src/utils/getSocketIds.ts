import { userSocketIDs } from "@/socket";

export const getSingleSocket = (userId: string) => {
    const socketId = userSocketIDs.get(userId);
    if (socketId) {
        return socketId;
    }
    return undefined;
};

export type Members = {
    online: string[],
    offline: string[]
}
export const getMultiSockets = (users: string[], currUserId: string): Members => {
    const online: string[] = [];
    const offline: string[] = [];

    users.forEach((user) => {
        const socketId = userSocketIDs.get(user);
        if (socketId !== undefined) {
            return online.push(socketId);
        }
        else if (user !== currUserId) {
            return offline.push(user);
        }
    });


    const membersData: Members = {
        online: online,
        offline: offline
    };
    return membersData;
};