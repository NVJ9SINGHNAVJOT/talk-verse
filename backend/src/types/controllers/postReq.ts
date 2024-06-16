import { categoriesSchema, postgreSQLIdSchema } from "@/validators/zod";
import z from "zod";

export const CreatePostReqSchema = z.object({
  category: categoriesSchema,
  title: z.string().optional(),
  tags: z.string().optional(), // JSON.stringify -> string[]
  content: z.string().optional(), // JSON.stringify -> string[]
});
export type CreatePostReq = z.infer<typeof CreatePostReqSchema>;

export const DeletePostReqSchema = z.object({
  postId: z.number().min(1),
});
export type DeletePostReq = z.infer<typeof DeletePostReqSchema>;

export const SavePostReqSchema = z.object({
  postId: z.number().min(1),
  update: z.enum(["add", "remove"]),
});
export type SavePostReq = z.infer<typeof SavePostReqSchema>;

export const DeleteStoryReqSchema = z.object({
  storyId: postgreSQLIdSchema,
});
export type DeleteStoryReq = z.infer<typeof DeleteStoryReqSchema>;

export const UpdateLikeReqSchema = z.object({
  postId: postgreSQLIdSchema,
  update: z.enum(["add", "delete"]),
});
export type UpdateLikeReq = z.infer<typeof UpdateLikeReqSchema>;

export const AddCommentReqSchema = z.object({
  postId: z.number().min(1),
  commentText: z.string().min(1).max(200),
});
export type AddCommentReq = z.infer<typeof AddCommentReqSchema>;

export const DeleteCommentReqSchema = z.object({
  postId: z.number().min(1),
  commentId: z.number().min(1),
});
export type DeleteCommentReq = z.infer<typeof DeleteCommentReqSchema>;

export const PostCommentsReqSchema = z.object({
  postId: postgreSQLIdSchema,
  createdAt: z.string().datetime(),
});
export type PostCommenstReq = z.infer<typeof PostCommentsReqSchema>;

export const GetCreatedAtReqSchema = z.object({
  createdAt: z.string().datetime(),
});
export type GetCreatedAtReq = z.infer<typeof GetCreatedAtReqSchema>;

export const CategoryPostsReqSchema = z.object({
  category: categoriesSchema,
  createdAt: z.string().datetime(),
});
export type CategoryPostsReq = z.infer<typeof CategoryPostsReqSchema>;
