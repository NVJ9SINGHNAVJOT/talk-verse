import { CreatePostRs, CreateStoryRs, UserBlogProfileRs } from "@/types/apis/postApiRs";
import { fetchApi } from "@/services/fetchApi";
import { postEndPoints } from "@/services/apis";
import { CommonRs } from "@/types/apis/common";

const {
    USER_BLOG_PROFILE,
    CREATE_POST,
    DELETE_POST,
    CREATE_STORY,
    DELETE_STORY
} = postEndPoints;

export const userBlogProfileApi = async (): Promise<UserBlogProfileRs> => {
    try {
        const resData: UserBlogProfileRs = await fetchApi('GET', USER_BLOG_PROFILE);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const createPostApi = async (data: FormData): Promise<CreatePostRs> => {
    try {
        const resData: CreatePostRs = await fetchApi('POST', CREATE_POST, data);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const deletePostApi = async (postId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('DELETE', DELETE_POST, null, null, { 'postId': postId });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const createStoryApi = async (data: FormData): Promise<CreateStoryRs> => {
    try {
        const resData: CreateStoryRs = await fetchApi('POST', CREATE_STORY, data);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const deleteStoryApi = async (storyId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('DELETE', DELETE_STORY, null, null, { 'storyId': storyId });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};