/* ===== Caution: Any changes in socket events types need to be changed in backend as well ===== */

// client
export type SoUserRequest = {
    id: string,
    userName: string,
    imageUrl?: string | undefined
}
export type SoRequestAccepted = {
    id: string,
    chatId: string,
    firstName: string,
    lastName: string,
    imageUrl?: string | undefined,
    publicKey: string
}
export type SoAddedInGroup = {
    id: string,
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
    imageUrl?: string | undefined,
}

// server
export type SoSendMessage = {
    chatId: string,
    to: string,
    fromText: string,
    toText: string
}
export type SoSendGroupMessage = {
    id: string,
    text: string,
    firstName: string,
    lastName: string,
    imageUrl?: string
}
