import { chatEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { ChatBarData } from "@/types/apis/chatApiRs";
const {
    CHAT_BAR_DATA,
    CHAT_MESSAGES,
    GROUP_MESSAGES,
    MESSAGE_FILE
} = chatEndPoints;

export const getUsersApi = async (): Promise<ChatBarData> => {
    try {
        const resData: ChatBarData = await fetchApi('GET', CHAT_BAR_DATA);
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as ChatBarData;
    } catch (error) {
        return {} as ChatBarData;
    }
};