export type CreatePostRs = {
  success: boolean;
  message: string;
  post: {
    id: number;
    userId: number;
    category: string;
    title?: string;
    mediaUrls?: string[];
    tags?: string[];
    content?: string[];
    likesCount: number;
    createdAt: Date;
  };
} | null;

export type CreateStoryRs = {
  success: boolean;
  message: string;
  id: number;
  storyUrl: string;
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

export type GetStoriesRs = {
  success: boolean;
  message: string;
  stories: {
    userName: string;
    imageUrl: string;
    storyUrl: string;
    createdAt: string;
  }[];
} | null;

export type Post = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  category: string;
  title?: string;
  mediaUrls?: string[];
  tags?: string[];
  content?: string[];
  likesCount: number;
  createdAt: Date;
};

export type PostsRs = {
  success: boolean;
  message: string;
  posts?: Post[];
} | null;
