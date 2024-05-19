/* ===== Caution: Any changes in socket events types need to be changed in backend as well ===== */

// client
export type SoUserRequest = {
    _id: string,
    userName: string,
    imageUrl?: string
}
export type SoRequestAccepted = {
    _id: string,
    chatId: string,
    firstName: string,
    lastName: string,
    imageUrl?: string,
    publicKey: string
}
export type SoAddedInGroup = {
    _id: string,
    groupName: string,
    gpImageUrl?: string
}
export type SoMessageRecieved = {
    uuId: string,
    isFile: boolean,
    chatId: string,
    from: string,
    text: string,
    createdAt: string,
}
export type SoGroupMessageRecieved = {
    uuId: string,
    isFile: boolean,
    from: string,
    to: string,
    text: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    imageUrl?: string,
}

// server
export type SoSendMessage = {
    chatId: string,
    to: string,
    fromText: string,
    toText: string
}
export type SoSendGroupMessage = {
    _id: string,
    text: string,
    firstName: string,
    lastName: string,
    imageUrl?: string
}
