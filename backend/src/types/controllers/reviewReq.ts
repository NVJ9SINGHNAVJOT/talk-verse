import z from "zod";

export const PostReviewReqSchema = z.object({
  reviewText: z.string().min(1).max(150),
});
