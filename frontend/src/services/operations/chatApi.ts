import { chatEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { ChatBarDataRs } from "@/types/apis/chatApiRs";
const {
    CHAT_BAR_DATA,
    CHAT_MESSAGES,
    GROUP_MESSAGES,
    MESSAGE_FILE
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