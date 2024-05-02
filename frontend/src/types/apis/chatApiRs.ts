export type ChatBarData = {
    success: boolean,
    message: string,
    data: {
        _id: string,
        firstName: string,
        lastName: string,
        imageUrl?: string
    }[]
}