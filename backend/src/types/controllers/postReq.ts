import { categoriesSchema } from "@/validators/zod";
import z from "zod";

export const CreatePostReqSchema = z.object({
    category: categoriesSchema,
    title: z.string().optional(),
    tags: z.string().optional(), // JSON.stringify -> string[]
    content: z.string().optional(), // JSON.stringify -> string[]
});
export type CreatePostReq = z.infer<typeof CreatePostReqSchema>;