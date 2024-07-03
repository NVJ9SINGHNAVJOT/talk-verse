import {
  AddCommentRs,
  CreatePostRs,
  CreateStoryRs,
  GetStoriesRs,
  PostCommentsRs,
  PostsRs,
  UserStoryRs,
} from "@/types/apis/postApiRs";
import { fetchApi } from "@/services/fetchApi";
import { postEndPoints } from "@/services/apis";
import { CommonRs } from "@/types/apis/common";

export const createPostApi = async (data: FormData): Promise<CreatePostRs | null> => {
  const resData: CreatePostRs = await fetchApi("POST", postEndPoints.CREATE_POST, data);
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const deletePostApi = async (postId: number): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "DELETE",
    postEndPoints.DELETE_POST,
    { postId: postId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const savePostApi = async (postId: number, update: "add" | "remove"): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    postEndPoints.SAVE_POST,
    { postId: postId, update: update },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const createStoryApi = async (data: FormData): Promise<CreateStoryRs | null> => {
  const resData: CreateStoryRs = await fetchApi("POST", postEndPoints.CREATE_STORY, data);
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const deleteStoryApi = async (storyId: number): Promise<boolean> => {
  const resData: CommonRs = await fetchApi("DELETE", postEndPoints.DELETE_STORY, null, null, {
    storyId: `${storyId}`,
  });
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const userStoryApi = async (): Promise<UserStoryRs | null> => {
  const resData: UserStoryRs = await fetchApi("GET", postEndPoints.USER_STORY);
  if (resData) {
    return resData;
  }
  return null;
};

export const updateLikeApi = async (postId: number, update: "add" | "delete"): Promise<boolean> => {
  const resData: CommonRs = await fetchApi("POST", postEndPoints.UPDATE_LIKE, null, null, {
    postId: `${postId}`,
    update: update,
  });
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const addCommentApi = async (postId: number, comment: string): Promise<AddCommentRs | null> => {
  const resData: AddCommentRs = await fetchApi(
    "POST",
    postEndPoints.ADD_COMMENT,
    { postId: postId, commentText: comment },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const deleteCommentApi = async (postId: number, commentId: number): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "DELETE",
    postEndPoints.DELETE_COMMENT,
    { postId: postId, commentId: commentId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const postCommentsApi = async (postId: number, createdAt: string): Promise<PostCommentsRs | null> => {
  const resData: PostCommentsRs = await fetchApi("GET", postEndPoints.POST_COMMENTS, null, null, {
    postId: `${postId}`,
    createdAt: createdAt,
  });

  if (resData) {
    return resData;
  }
  return null;
};

export const getStoriesApi = async (createdAt: string): Promise<GetStoriesRs | null> => {
  const resData: GetStoriesRs = await fetchApi("GET", postEndPoints.GET_STORIES, null, null, {
    createdAt: createdAt,
  });
  if (resData) {
    return resData;
  }
  return null;
};

export const recentPostsApi = async (createdAt: string): Promise<PostsRs | null> => {
  const resData: PostsRs = await fetchApi("GET", postEndPoints.RECENT_POSTS, null, null, { createdAt: createdAt });
  if (resData) {
    return resData;
  }
  return null;
};

export const trendingPostsApi = async (createdAt: string): Promise<PostsRs | null> => {
  const resData: PostsRs = await fetchApi("GET", postEndPoints.TRENDING_POSTS, null, null, { createdAt: createdAt });
  if (resData) {
    return resData;
  }
  return null;
};

export const categoryPostsApi = async (category: string, createdAt: string): Promise<PostsRs | null> => {
  const resData: PostsRs = await fetchApi("GET", postEndPoints.CATEGORY_POSTS, null, null, {
    category: category,
    createdAt: createdAt,
  });
  if (resData) {
    return resData;
  }
  return null;
};
