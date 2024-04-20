
import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CheckUserApi } from "@/types/apis/authApiRs";
import { Common } from "@/types/apis/common";


const {
    SIGNUP_API,
    LOGIN_API,
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

export const logInApi = async (data: object): Promise<boolean> => {
    try {
        const resData: Common = await fetchApi('POST', LOGIN_API, data, { 'Content-Type': 'application/json' });
        if (resData && resData.success) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const checkUserApi = async (): Promise<boolean | CheckUserApi> => {
    try {
        const resData: CheckUserApi = await fetchApi('POST', LOGIN_API);
        if (resData && resData.success) {
            return resData;
        }
        return false;
    } catch (error) {
        return false;
    }
};

