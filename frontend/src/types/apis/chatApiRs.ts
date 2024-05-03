
export type ChatBarDataRs = {
    success: boolean,
    message: string,
    friends: {
        _id: string,
        firstName: string,
        lastName: string,
        imageUrl?: string
    }[],
    groups: {
        _id: string,
        groupName: string,
        gpImageUrl?: string
    }[]
}