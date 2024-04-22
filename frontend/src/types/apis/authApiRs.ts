
export type LogInApiRs = {
    success: boolean,
    message: string,
    firstName: string,
    lastName: string,
    imageUrl?: string
}

export type SocketApiRs = {
    success: boolean,
    message: string,
    userId: string,
}