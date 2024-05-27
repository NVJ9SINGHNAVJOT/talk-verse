import { userBlogEndPoints } from "@/services/apis";
import { userBlogProfileRs } from "@/types/apis/blogApiRs";
import { fetchApi } from "@/services/fetchApi";

const {
    USER_BLOG_PROFILE
} = userBlogEndPoints;

export const userBlogProfileApi = async (): Promise<userBlogProfileRs> => {
    try {
        const resData: userBlogProfileRs = await fetchApi('GET', USER_BLOG_PROFILE);
        if (resData && resData.success === true) {
            return resData;
        }
        return null;
    } catch (error) {
        return null;
    }
};