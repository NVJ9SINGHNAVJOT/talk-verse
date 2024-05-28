import { CreatePostRs, UserBlogProfileRs } from "@/types/apis/postApiRs";
import { fetchApi } from "@/services/fetchApi";
import { postEndPoints } from "@/services/apis";

const {
    USER_BLOG_PROFILE,
    CREATE_POST
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