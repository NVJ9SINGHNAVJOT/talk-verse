import { chatEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { ChatBarDataRs, GetChatMessagesRs, GetGroupMessagesRs } from "@/types/apis/chatApiRs";
import { CommonRs } from "@/types/apis/common";
const {
    CHAT_BAR_DATA,
    CHAT_MESSAGES,
    GROUP_MESSAGES,
    FILE_MESSAGE,
    CREATE_GROUP
} = chatEndPoints;

export const chatBarDataApi = async (): Promise<ChatBarDataRs> => {
    try {
        const resData: ChatBarDataRs = await fetchApi('GET', CHAT_BAR_DATA);
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as ChatBarDataRs;
    } catch (error) {
        return {} as ChatBarDataRs;
    }
};

export const getMessagesApi = async (chatId: string, skip: string): Promise<GetChatMessagesRs> => {
    try {
        const resData: GetChatMessagesRs = await fetchApi('GET', CHAT_MESSAGES, null, null,
            { 'chatId': chatId, 'skip': skip });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as GetChatMessagesRs;
    } catch (error) {
        return {} as GetChatMessagesRs;
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

export const createGroupApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', CREATE_GROUP, data);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const getGroupMessagesApi = async (groupId: string, skip: string): Promise<GetGroupMessagesRs> => {
    try {
        const resData: GetGroupMessagesRs = await fetchApi('GET', GROUP_MESSAGES, null, null,
            { 'groupId': groupId, 'skip': skip });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as GetGroupMessagesRs;
    } catch (error) {
        return {} as GetGroupMessagesRs;
    }
};