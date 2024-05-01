import { notificationEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { GetUsersApi } from "@/types/apis/notificationApiRs";

const {
    GET_USERS_API,
} = notificationEndPoints;

export const getUsersApi = async (userName: string): Promise<GetUsersApi> => {
    try {
        const resData: GetUsersApi = await fetchApi('POST', GET_USERS_API, { userName }, { 'Content-Type': 'application/json' });
        if (resData) {
            return resData;
        }
        return {} as GetUsersApi;
    } catch (error) {
        return {} as GetUsersApi;
    }
};

