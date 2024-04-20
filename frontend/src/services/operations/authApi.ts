
import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { Common } from "@/types/apis/common";


const {
    SIGNUP_API,
} = authEndPoints;

export const signUpApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: Common = await fetchApi('POST', SIGNUP_API, data);
        if (resData && resData.success) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}; 