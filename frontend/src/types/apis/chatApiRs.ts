import { ChatBarData, Friend } from "@/redux/slices/chatSlice";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { SoAddedInGroup, SoMessageRecieved } from "@/types/socket/eventTypes";

export type ChatBarDataRs = {
    success: boolean,
    message: string,
    friends?: Friend[],
    groups?: SoAddedInGroup[],
    chatBarData?: ChatBarData[],
    friendPublicKeys?: {
        friendId: string,
        publicKey: string
    }[]
} | null

export type GetChatMessagesRs = {
    success: boolean,
    message: string,
    messages?: SoMessageRecieved[]
} | null

export type GetGroupMessagesRs = {
    success: boolean,
    message: string,
    messages?: GroupMessages[]
} | null

export type CreateGroupRs = {
    success: boolean,
    message: string,
    newGroup: SoAddedInGroup
} | null