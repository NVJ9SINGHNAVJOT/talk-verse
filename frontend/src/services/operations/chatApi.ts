import { chatEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { ChatBarDataRs, GetChatMessagesRs, GetGroupMessagesRs } from "@/types/apis/chatApiRs";
import { CommonRs } from "@/types/apis/common";
const {
    CHAT_BAR_DATA,
    CHAT_MESSAGES,
    GROUP_MESSAGES,
    FILE_MESSAGE,
} = chatEndPoints;

export const chatBarDataApi = async (): Promise<ChatBarDataRs> => {
    try {
        const resData: ChatBarDataRs = await fetchApi('GET', CHAT_BAR_DATA);
        // success false is used in response
        if (resData) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const getMessagesApi = async (chatId: string, createdAt?: string): Promise<GetChatMessagesRs> => {
    try {
        const resData: GetChatMessagesRs = await fetchApi('GET', CHAT_MESSAGES, null, null,
            { 'chatId': chatId, 'createdAt': createdAt ? createdAt : "" });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const fileMessageApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', FILE_MESSAGE, data);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const getGroupMessagesApi = async (groupId: string, createdAt?: string): Promise<GetGroupMessagesRs> => {
    try {
        const resData: GetGroupMessagesRs = await fetchApi('GET', GROUP_MESSAGES, null, null,
            { 'groupId': groupId, 'createdAt': createdAt ? createdAt : "" });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};