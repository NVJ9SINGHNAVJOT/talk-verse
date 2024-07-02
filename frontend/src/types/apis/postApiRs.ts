import { CommonRs } from "@/types/apis/common";

export type CreatePostRs = CommonRs & {
  post: {
    id: number;
    userId: number;
    category: string;
    title?: string;
    mediaUrls: string[];
    tags: string[];
    content: string[];
    likesCount: number;
    createdAt: string;
  };
};

export type UserStory = {
  id: number;
  storyUrl: string;
};
export type CreateStoryRs = CommonRs & {
  story: UserStory;
};

export type UserStoryRs = CommonRs & {
  story?: UserStory;
};

export type AddCommentRs = CommonRs & {
  comment: {
    id: number;
    commentText: string;
    createdAt: string;
  };
};

export type Story = {
  userName: string;
  imageUrl?: string;
  storyUrl: string;
  createdAt: string;
};
export type GetStoriesRs = CommonRs & {
  stories?: Story[];
};

export type Comment = {
  id: number;
  isCurrentUser: boolean;
  userId: number;
  imageUrl?: string;
  userName: string;
  commentText: string;
  createdAt: string;
};
export type PostCommentsRs = CommonRs & {
  comments?: Comment[];
};

export type Post = {
  id: number;
  isCurrentUser: boolean;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  userName: string;
  isSaved: boolean;
  isLiked: boolean;
  commentsCount: number;
  category: string;
  title?: string;
  mediaUrls: string[];
  tags: string[];
  content: string[];
  likesCount: number;
  createdAt: string;
};

export type PostsRs = CommonRs & {
  posts?: Post[];
};
