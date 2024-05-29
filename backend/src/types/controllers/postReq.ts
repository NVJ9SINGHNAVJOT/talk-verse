export type CreatePostReq = {
    category: string,
    title: string | null,
    tags: string | null, // JSON.stringify -> string[]
    content: string | null, // JSON.stringify -> string[]
}