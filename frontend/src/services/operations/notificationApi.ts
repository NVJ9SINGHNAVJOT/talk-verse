import { notificationEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CommonRs } from "@/types/apis/common";
import { AcceptRequestRs, CheckOnlineFriendsRs, GetAllNotificationsRs, GetUsersRs } from "@/types/apis/notificationApiRs";


const {
    GET_USERS,
    SEND_REQUEST,
    GET_ALL_NOTIFICATIONS,
    ACCEPT_REQUEST,
    CHECK_ONLINE_FRIENDS,
    SET_UNSEEN_COUNT
} = notificationEndPoints;

export const getUsersApi = async (userName: string): Promise<GetUsersRs> => {
    try {
        const resData: GetUsersRs = await fetchApi('GET', GET_USERS, null, null, { 'userName': userName });
        // success false is used in response
        if (resData) {
            return resData;
        }
        return {} as GetUsersRs;
    } catch (error) {
        return {} as GetUsersRs;
    }
};

export const sendRequestApi = async (userId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SEND_REQUEST, { reqUserId: userId }, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const getAllNotificationsApi = async (): Promise<GetAllNotificationsRs> => {
    try {
        const resData: GetAllNotificationsRs = await fetchApi('GET', GET_ALL_NOTIFICATIONS);
        if (resData) {
            return resData;
        }
        return {} as GetAllNotificationsRs;
    } catch (error) {
        return {} as GetAllNotificationsRs;
    }
};


export const acceptRequestApi = async (userId: string): Promise<AcceptRequestRs> => {
    try {
        const resData: AcceptRequestRs = await fetchApi('POST', ACCEPT_REQUEST, { acceptUserId: userId }, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as AcceptRequestRs;
    } catch (error) {
        return {} as AcceptRequestRs;
    }
};

export const checkOnlineFriendsApi = async (): Promise<CheckOnlineFriendsRs> => {

    try {
        const resData: CheckOnlineFriendsRs = await fetchApi('GET', CHECK_ONLINE_FRIENDS);
        if (resData) {
            return resData;
        }
        return {} as CheckOnlineFriendsRs;
    } catch (error) {
        return {} as CheckOnlineFriendsRs;
    }
};

export const setUnseenCount = async (mainId: string, count: number): Promise<boolean> => {

    try {
        const resData: CommonRs = await fetchApi('POST', SET_UNSEEN_COUNT, { mainId: mainId, count: count });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};