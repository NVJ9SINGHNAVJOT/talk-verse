export type CreatePostRs = {
  success: boolean;
  message: string;
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
} | null;

export type UserStory = {
  id: number;
  storyUrl: string;
};
export type CreateStoryRs = {
  success: boolean;
  message: string;
  story: UserStory;
} | null;

export type UserStoryRs = {
  success: boolean;
  message: string;
  story?: UserStory;
} | null;

export type AddCommentRs = {
  success: boolean;
  message: string;
  comment: {
    id: number;
    userId: number;
    text: string;
    createdAt: Date;
  };
} | null;

export type Story = {
  userName: string;
  imageUrl?: string;
  storyUrl: string;
  createdAt: string;
};
export type GetStoriesRs = {
  success: boolean;
  message: string;
  stories?: Story[];
} | null;

export type Comment = {
  id: number;
  isCurrentUser: boolean;
  userId: number;
  imageUrl?: string;
  userName: string;
  commentText: string;
  createdAt: string;
};
export type PostCommentsRs = {
  success: boolean;
  message: string;
  comments?: Comment[];
} | null;

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

export type PostsRs = {
  success: boolean;
  message: string;
  posts?: Post[];
} | null;
