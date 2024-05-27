export type userBlogProfileRs = {
    success: boolean,
    message: string,
    blogProfile: {
        followingCount: number,
        followersCount: number
    }
} | null