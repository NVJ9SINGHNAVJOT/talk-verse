import { ProfileRs, SetProfileImageRs, UserBlogProfileRs } from "@/types/apis/profileApiRs";
import { profileEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CommonRs } from "@/types/apis/common";
import { NewProfileData } from "@/components/core/profile/Settings";
import { PostsRs } from "@/types/apis/postApiRs";

export const checkUserNameApi = async (userName: string): Promise<CommonRs> => {
  try {
    const resData: CommonRs = await fetchApi("GET", profileEndPoints.CHECK_USERNAME, null, null, {
      userName: userName,
    });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getProfileApi = async (): Promise<ProfileRs> => {
  try {
    const resData: ProfileRs = await fetchApi("GET", profileEndPoints.PROFILE_DETAILS);
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
    const resData: SetProfileImageRs = await fetchApi("POST", profileEndPoints.SET_PROFILE_IMAGE, data);
    if (resData && resData.success === true) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const setProfileDetailsApi = async (data: NewProfileData): Promise<ProfileRs> => {
  try {
    const resData: ProfileRs = await fetchApi("POST", profileEndPoints.SET_PROFILE_DETAILS, data, {
      "Content-Type": "application/json",
    });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const userBlogProfileApi = async (): Promise<UserBlogProfileRs> => {
  try {
    const resData: UserBlogProfileRs = await fetchApi("GET", profileEndPoints.USER_BLOG_PROFILE);
    if (resData && resData.success === true) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const userPostsApi = async (createdAt: string): Promise<PostsRs> => {
  try {
    const resData: PostsRs = await fetchApi("GET", profileEndPoints.USER_POSTS, null, null, {
      createdAt: createdAt,
    });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};
