import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { LogInApiRs, SocketApiRs } from "@/types/apis/authApiRs";
import { CommonRs } from "@/types/apis/common";


const {
    SIGNUP_API,
    LOGIN_API,
    SOCKET_API
} = authEndPoints;

export const signUpApi = async (data: FormData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SIGNUP_API, data);
        if (resData && resData.success) {
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
        if (resData && resData.success) {
            return resData;
        }
        return {} as LogInApiRs;
    } catch (error) {
        return {} as LogInApiRs;
    }
};

export const socketApi = async (): Promise<SocketApiRs> => {
    try {
        const resData: SocketApiRs = await fetchApi('GET', SOCKET_API);
        if (resData && resData.success) {
            return resData;
        }
        return {} as SocketApiRs;
    } catch (error) {
        return {} as SocketApiRs;
    }
};

