export type CreatePostReq = {
    category: string | null,
    title: string | null,
    tags: string | null, // JSON.stringify -> string[]
    content: string | null, // JSON.stringify -> string[]
}