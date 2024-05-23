import { GetProfileRs, SetProfileImageRs } from "@/types/apis/profileApiRs";
import { profileEndPoints } from "../apis";
import { fetchApi } from "../fetchApi";
import { CommonRs } from "@/types/apis/common";
import { NewProfileData } from "@/components/core/profile/Settings";

const {
    CHECK_USERNAME,
    PROFILE_DETAILS,
    SET_PROFILE_IMAGE,
    SET_PROFILE_DETAILS,
} = profileEndPoints;

export const checkUserNameApi = async (userName: string): Promise<CommonRs> => {
    try {
        const resData: CommonRs = await fetchApi('GET', CHECK_USERNAME, null, null, { 'userName': userName });
        if (resData) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const getProfileApi = async (): Promise<GetProfileRs> => {
    try {
        const resData: GetProfileRs = await fetchApi('GET', PROFILE_DETAILS);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const setProfileImageApi = async (data: FormData): Promise<SetProfileImageRs> => {
    try {
        const resData: SetProfileImageRs = await fetchApi('POST', SET_PROFILE_IMAGE, data);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const setProfileDetailsApi = async (data: NewProfileData): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', SET_PROFILE_DETAILS, data, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};