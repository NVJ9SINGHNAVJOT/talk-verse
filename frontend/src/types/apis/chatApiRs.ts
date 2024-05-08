import { ChatBarData, Friend, Group } from "@/redux/slices/chatSlice";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { SoMessageRecieved } from "@/types/socket/eventTypes";

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
    messages: SoMessageRecieved[]
}

export type GetGroupMessagesRs = {
    success: boolean,
    message: string,
    messages: GroupMessages[]
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