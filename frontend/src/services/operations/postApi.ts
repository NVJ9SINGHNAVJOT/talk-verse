import { AddCommentRs, CreatePostRs, CreateStoryRs, GetStoriesRs, PostsRs } from "@/types/apis/postApiRs";
import { fetchApi } from "@/services/fetchApi";
import { postEndPoints } from "@/services/apis";
import { CommonRs } from "@/types/apis/common";

export const createPostApi = async (data: FormData): Promise<CreatePostRs> => {
  try {
    const resData: CreatePostRs = await fetchApi("POST", postEndPoints.CREATE_POST, data);
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
    const resData: CommonRs = await fetchApi("DELETE", postEndPoints.DELETE_POST, null, null, { postId: postId });
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
    const resData: CreateStoryRs = await fetchApi("POST", postEndPoints.CREATE_STORY, data);
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
    const resData: CommonRs = await fetchApi("DELETE", postEndPoints.DELETE_STORY, null, null, { storyId: storyId });
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const updateLikeApi = async (postId: string, update: "add" | "delete"): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi("POST", postEndPoints.UPDATE_LIKE, null, null, {
      postId: postId,
      update: update,
    });
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
    const resData: AddCommentRs = await fetchApi(
      "POST",
      postEndPoints.ADD_COMMENT,
      { postId: postId, comment: comment },
      { "Content-Type": "application/json" }
    );
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
    const resData: CommonRs = await fetchApi("DELETE", postEndPoints.DELETE_COMMENT, null, null, {
      commentId: commentId,
    });
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getStoriesApi = async (createdAt: string): Promise<GetStoriesRs> => {
  try {
    const resData: GetStoriesRs = await fetchApi("GET", postEndPoints.GET_STORIES, null, null, {
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

export const recentPostsApi = async (createdAt: string): Promise<PostsRs> => {
  try {
    const resData: PostsRs = await fetchApi("GET", postEndPoints.RECENT_POSTS, null, null, { createdAt: createdAt });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const trendingPostsApi = async (createdAt: string): Promise<PostsRs> => {
  try {
    const resData: PostsRs = await fetchApi("GET", postEndPoints.TRENDING_POSTS, null, null, { createdAt: createdAt });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const categoryPosts = async (category: string, createdAt: string): Promise<PostsRs> => {
  try {
    const resData: PostsRs = await fetchApi("GET", postEndPoints.CATEGORY_POSTS, null, null, {
      category: category,
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
