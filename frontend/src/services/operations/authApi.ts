import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CheckUserApi, LogInApiRs } from "@/types/apis/authApiRs";
import { CommonRs } from "@/types/apis/common";


const {
    SIGNUP_API,
    LOGIN_API,
    CHECK_USER_API,
} = authEndPoints;

export const signUpApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SIGNUP_API, data);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const logInApi = async (data: object): Promise<LogInApiRs> => {
    try {
        const resData: LogInApiRs = await fetchApi('POST', LOGIN_API, data, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as LogInApiRs;
    } catch (error) {
        return {} as LogInApiRs;
    }
};

export const checkUserApi = async (): Promise<CheckUserApi> => {
    try {
        const resData: CheckUserApi = await fetchApi('GET', CHECK_USER_API);
        if (resData && resData.success === true &&
            resData.firstName &&
            resData.lastName) {
            return resData;
        }
        return {} as CheckUserApi;
    } catch (error) {
        return {} as CheckUserApi;
    }
};


