export type FileMessageBody = {
    isGroup: boolean,
    mainId: string,

    from: string,
    to: string,
    firstName: string,
    lastName: string,
    imageUrl?: string
}

export type CreateGroupBody = {
    groupName: string,
    userIdsInGroup: string[]
}