import { UserRequest } from "@/redux/slices/chatSlice";

export type GetUsersRs = {
    success: boolean,
    message: string,
    users: UserRequest[],
}

export type GetAllNotificationsRs = {
    success: boolean,
    message: string,
    userReqs?: UserRequest[],
    unseenMessages?: {
        mainId: string,
        count: number
    }[]
}

export type AcceptRequestRs = {
    success: boolean,
    message: string,
    newFriend: {
        _id: string,
        firstName: string,
        lastName: string,
        imageUrl?: string
    },
    newChatId: string,
    newFriendPublicKey: string
}

export type CheckOnlineFriendsRs = {
    success: boolean,
    message: string,
    onlineFriends?: string[]
}
