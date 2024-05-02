import { notificationEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CommonRs } from "@/types/apis/common";
import { UsersRs } from "@/types/apis/notificationApiRs";

const {
    GET_USERS,
    SEND_REQUEST,
    GET_ALL_NOTIFICATIONS,
    ACCEPT_REQUEST
} = notificationEndPoints;

export const getUsersApi = async (userName: string): Promise<UsersRs> => {
    try {
        const resData: UsersRs = await fetchApi('GET', GET_USERS, null, null, { 'userName': userName });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as UsersRs;
    } catch (error) {
        return {} as UsersRs;
    }
};

export const sendRequestApi = async (userId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SEND_REQUEST, { userId }, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const getAllNotificationsApi = async (): Promise<UsersRs> => {
    try {
        const resData: UsersRs = await fetchApi('GET', GET_ALL_NOTIFICATIONS);
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as UsersRs;
    } catch (error) {
        return {} as UsersRs;
    }
};


export const acceptRequestApi = async (userId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('GET', ACCEPT_REQUEST, { userId });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};