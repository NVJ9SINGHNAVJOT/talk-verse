export type OtherUserIdReq = {
    otherUserId: string,
};

export type SetUnseenCountReq = {
    mainId: string,
    count: number,
}

export type CreateGroupReq = {
    groupName: string,
    userIdsInGroup: string // JSON.stringify -> string[]
}

export type SetOrderReq = {
    mainId: string
}