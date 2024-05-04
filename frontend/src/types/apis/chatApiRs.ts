
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

export type GetChatMessagesRs = {
    success: boolean,
    message: string,
    messages: {
        _id: string,
        from: string,
        to: string,
        text: string,
        createdAt: Date
    }[]
}

export type GetGroupMessagesRs = {
    success: boolean,
    message: string,
    messages: {
        _id: string,
        from: string,
        text: string,
        createdAt: Date
    }[]
}