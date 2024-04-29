export type LogInApiRs = {
    success: boolean,
    message: string,
    firstName: string,
    lastName: string,
    imageUrl?: string
}

export type CheckUserApi = {
    success: boolean,
    message: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string
}