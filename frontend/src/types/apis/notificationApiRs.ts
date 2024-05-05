import { ReqUser } from "@/lib/inputs/chatsearchinput/ChatSearchInput";

export type GetUsersRs = {
    success: boolean,
    message: string,
    users: ReqUser[],
}

export type GetAllNotificationsRs = {
    success: boolean,
    message: string,
    users: ReqUser[],
    unseenMessages: {
        mainId: string,
        unseenCount: number
    }[]
}

