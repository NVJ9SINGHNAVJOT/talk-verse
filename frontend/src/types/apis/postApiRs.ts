export type UserBlogProfileRs = {
    success: boolean,
    message: string,
    blogProfile: {
        followingCount: number,
        followersCount: number
    }
} | null

export type CreatePostRs = {
    success: boolean,
    message: string,
    post: {
        id: number,
        userId: number,
        category: string,
        title?: string,
        mediaUrls?: string[],
        tags?: string[],
        content?: string[],
        likesCount: number,
        createdAt: Date
    }
} | null

export type CreateStoryRs = {
    success: boolean,
    message: string,
    id: number,
    storyUrl: string
} | null

export type AddCommentRs = {
    success: boolean,
    message: string,
    id: number,
    userId: number,
    text: string
    createdAt: Date,
} | null