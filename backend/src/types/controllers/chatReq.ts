export type FileMessageBody = {
    isGroup: string,
    mainId: string,

    to: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string
}

export type CreateGroupBody = {
    groupName: string,
    userIdsInGroup: string // JSON.stringify
}