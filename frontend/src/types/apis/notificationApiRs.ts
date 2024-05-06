import { UserRequest } from "@/redux/slices/chatSlice";
import { User } from "@/redux/slices/userSlice";

export type GetUsersRs = {
    success: boolean,
    message: string,
    users: UserRequest[],
}

export type GetAllNotificationsRs = {
    success: boolean,
    message: string,
    users: UserRequest[],
    unseenMessages: {
        mainId: string,
        unseenCount: number
    }[]
}

export type AcceptRequestRs = {
    success: boolean,
    message: string,
    newFriend: User,
    newChatId: string
}

export type CheckOnlineFriendsRs = {
    success: boolean,
    message: string,
    onlineFriends: string[]
}
