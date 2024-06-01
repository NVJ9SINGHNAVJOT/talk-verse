import { AddCommentRs, CreatePostRs, CreateStoryRs, GetStoriesRs, UserBlogProfileRs } from "@/types/apis/postApiRs";
import { fetchApi } from "@/services/fetchApi";
import { postEndPoints } from "@/services/apis";
import { CommonRs } from "@/types/apis/common";

const {
    USER_BLOG_PROFILE,
    CREATE_POST,
    DELETE_POST,
    CREATE_STORY,
    DELETE_STORY,
    UPDATE_LIKE,
    ADD_COMMENT,
    DELETE_COMMENT,
    GET_STORIES,
    RECENT_POSTS,
    TRENDING_POSTS,
    CATEGORY_POSTS
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

export const updateLikeApi = async (postId: string, update: 'add' | 'delete'): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('POST', UPDATE_LIKE, null, null, { 'postId': postId, update: update });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const addCommentApi = async (postId: string, comment: string): Promise<AddCommentRs> => {
    try {
        const resData: AddCommentRs = await fetchApi('POST', ADD_COMMENT, { postId: postId, comment: comment }, { 'Content-Type': 'application/json' });
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const deleteCommentApi = async (commentId: string): Promise<boolean> => {
    try {
        const resData: CommonRs = await fetchApi('DELETE', DELETE_COMMENT, null, null, { 'commentId': commentId });
        if (resData && resData.success === true) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const getStoriesApi = async (): Promise<GetStoriesRs> => {
    try {
        const resData: GetStoriesRs = await fetchApi('GET', GET_STORIES);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

