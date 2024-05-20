import { GetProfileRs, SetProfileImageRs } from "@/types/apis/profileApiRs";
import { profileEndPoints } from "../apis";
import { fetchApi } from "../fetchApi";
import { CommonRs } from "@/types/apis/common";

const {
    PROFILE_DETAILS,
    SET_PROFILE_IMAGE,
    SET_PROFILE_DETAILS,
} = profileEndPoints;

export const getProfileApi = async (): Promise<GetProfileRs> => {
    try {
        const resData: GetProfileRs = await fetchApi('GET', PROFILE_DETAILS);
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as GetProfileRs;
    } catch (error) {
        return {} as GetProfileRs;
    }
};

export const setProfileImageApi = async (data: FormData): Promise<SetProfileImageRs> => {
    try {
        const resData: SetProfileImageRs = await fetchApi('POST', SET_PROFILE_IMAGE, data);
        if (resData && resData.success === true) {
            return resData;
        }
        return {} as SetProfileImageRs;
    } catch (error) {
        return {} as SetProfileImageRs;
    }
};

export const setProfileDetailsApi = async (): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SET_PROFILE_DETAILS);
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};