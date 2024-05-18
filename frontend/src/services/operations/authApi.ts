import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CheckUserRs } from "@/types/apis/authApiRs";
import { CommonRs } from "@/types/apis/common";

const {
    SIGNUP,
    OTP,
    LOGIN,
    CHECK_USER,
    LOGOUT
} = authEndPoints;

export const signUpApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SIGNUP, data);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const sendOtpApi = async (email: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', OTP, { email: email }, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const logInApi = async (data: object): Promise<CheckUserRs> => {
    try {
        const resData: CheckUserRs = await fetchApi('POST', LOGIN, data, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as CheckUserRs;
    } catch (error) {
        return {} as CheckUserRs;
    }
};

export const checkUserApi = async (): Promise<CheckUserRs> => {
    try {
        const resData: CheckUserRs = await fetchApi('GET', CHECK_USER);
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as CheckUserRs;
    } catch (error) {
        return {} as CheckUserRs;
    }
};

export const logOutApi = async (): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('DELETE', LOGOUT);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};


