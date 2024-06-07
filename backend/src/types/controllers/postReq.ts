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
  postId: postgreSQLIdSchema,
});
export type DeletePostReq = z.infer<typeof DeletePostReqSchema>;

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
  postId: postgreSQLIdSchema,
  comment: z.string().min(1).max(100),
});
export type AddCommentReq = z.infer<typeof AddCommentReqSchema>;

export const DeleteCommentReqSchema = z.object({
  commentId: postgreSQLIdSchema,
});
export type DeleteCommentReq = z.infer<typeof DeleteCommentReqSchema>;

export const GetCreatedAtReqSchema = z.object({
  createdAt: z.string().datetime(),
});
export type GetCreatedAtReq = z.infer<typeof GetCreatedAtReqSchema>;

export const CategoryPostsReqSchema = z.object({
  category: categoriesSchema,
  createdAt: z.string().datetime(),
});
export type CategoryPostsReq = z.infer<typeof CategoryPostsReqSchema>;
