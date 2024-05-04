export type FileMessageBody = {
    isGroup: boolean,
    mainId: string,
    from: string,
    to: string
}

export type CreateGroupBody = {
    groupName: string,
    userIdsInGroup: string[]
}