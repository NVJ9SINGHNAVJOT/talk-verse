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