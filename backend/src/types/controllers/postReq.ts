export type CreatePostReq = {
    category: string,
    tags?: string, // JSON.stringify -> string[]
    content?: string, // JSON.stringify -> string[]
}