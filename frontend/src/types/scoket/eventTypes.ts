// client
export type SUserRequest = {
    _id: string,
    userName: string,
    imageUrl?: string
}
export type SRequestAccepted = {
    _id: string,
    chatId: string,
    firstName: string,
    lastName: string,
    imageUrl?: string,
}
export type SGroupMessageRecieved = {
    uuId: string,
    isFile: boolean,
    from: string,
    to: string,
    text: string,
    createAt: Date,
    firstName: string,
    lastName: string,
    imageUrl?: string,
}

export type SMessageRecieved = {
    uuId: string,
    isFile: boolean,
    from: string,
    text: string,
    createdAt: Date,
}
// server
