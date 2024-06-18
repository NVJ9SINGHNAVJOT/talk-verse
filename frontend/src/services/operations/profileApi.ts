import {
  ProfileRs,
  SetProfileImageRs,
  UserBlogProfileRs,
  UserFollowersRs,
  UserFollowingRs,
} from "@/types/apis/profileApiRs";
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

export const userFollowingApi = async (createdAt: string): Promise<UserFollowingRs> => {
  try {
    const resData: UserFollowingRs = await fetchApi("GET", profileEndPoints.USER_FOLLOWING, null, null, {
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

export const userfollowersApi = async (createdAt: string): Promise<UserFollowersRs> => {
  try {
    const resData: UserFollowersRs = await fetchApi("GET", profileEndPoints.USER_FOLLOWERS, null, null, {
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

export const removeFollowerApi = async (userId: number): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi(
      "DELETE",
      profileEndPoints.REMOVE_FOLLOWER,
      {
        otherUserId: userId,
      },
      {
        "Content-Type": "application/json",
      }
    );
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const unfollowUserApi = async (userId: number): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi(
      "DELETE",
      profileEndPoints.UNFOLLOW_FOLLOWING,
      {
        otherUserId: userId,
      },
      {
        "Content-Type": "application/json",
      }
    );
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const userSavedPostsApi = async (createdAt: string): Promise<PostsRs> => {
  try {
    const resData: PostsRs = await fetchApi("GET", profileEndPoints.POST_SAVES, null, null, {
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

export const postReviewApi = async (reviewText: string): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi(
      "POST",
      profileEndPoints.POST_REVIEW,
      { reviewText: reviewText },
      {
        "Content-Type": "application/json",
      }
    );
    if (resData) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
