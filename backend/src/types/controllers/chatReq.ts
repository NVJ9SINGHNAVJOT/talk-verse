export type FileMessageReq = {
    isGroup: string,
    mainId: string,

    to: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string
}

export type CreateGroupReq = {
    groupName: string,
    userIdsInGroup: string // JSON.stringify
}