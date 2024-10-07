import { categoriesSchema, postgreSQLIdSchema } from "@/validators/zod";
import z from "zod";

export const CreatePostReqSchema = z.object({
  category: categoriesSchema,
  title: z.string().min(1).max(100).optional(),
  tags: z.string().optional(), // JSON.stringify -> string[]
  content: z.string().optional(), // JSON.stringify -> string[]
});

export const DeletePostReqSchema = z.object({
  postId: z.number().min(1),
});

export const SavePostReqSchema = z.object({
  postId: z.number().min(1),
  update: z.enum(["add", "remove"]),
});

export const DeleteStoryReqSchema = z.object({
  storyId: postgreSQLIdSchema,
});

export const UpdateLikeReqSchema = z.object({
  postId: postgreSQLIdSchema,
  update: z.enum(["add", "delete"]),
});

export const AddCommentReqSchema = z.object({
  postId: z.number().min(1),
  commentText: z.string().min(1).max(200),
});

export const DeleteCommentReqSchema = z.object({
  postId: z.number().min(1),
  commentId: z.number().min(1),
});

export const PostCommentsReqSchema = z.object({
  postId: postgreSQLIdSchema,
  createdAt: z.string().datetime(),
});

export const CategoryPostsReqSchema = z.object({
  category: categoriesSchema,
  createdAt: z.string().datetime(),
});

export const TrendingPostsReqSchema = z.object({
  skip: z.string().regex(/^(0|[1-9]\d*)$/),
});
