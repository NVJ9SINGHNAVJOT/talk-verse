export type CreatePostReq = {
    category: string,
    title?: string,
    tags?: string, // JSON.stringify -> string[]
    content?: string, // JSON.stringify -> string[]
}