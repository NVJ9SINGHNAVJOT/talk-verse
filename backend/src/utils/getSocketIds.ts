import { userSocketIDs } from "@/socket";

export const getSingleSocket = (userId: string) => {
    const socketId = userSocketIDs.get(userId);
    if (socketId) {
        return socketId;
    }
    return "";
};

export const getMultiSockets = (users: string[]) => {
    const socketIds = users.map((user) => {
        if (userSocketIDs.has(user)) {
            return userSocketIDs.get(user);
        }
    });

    return socketIds;
};