import { ChatBarData, Friend, Group } from "@/redux/slices/chatSlice";

export type ChatBarDataRs = {
    success: boolean,
    message: string,
    friends?: Friend[],
    groups?: Group[],
    chatBarData?: ChatBarData[]
}

export type GetChatMessagesRs = {
    success: boolean,
    message: string,
    messages: {
        _id: string,
        from: string,
        to: string,
        text: string,
        createdAt: Date
    }[]
}

export type GetGroupMessagesRs = {
    success: boolean,
    message: string,
    messages: {
        _id: string,
        from: string,
        text: string,
        createdAt: Date
    }[]
}

export type CreateGroupRs = {
    success: boolean,
    message: string,
    newGroup: {
        _id: string,
        gpName: string,
        gpImageUrl: string
    }
}