import { Request, Response } from "express";
import { db } from "@/db/postgresql/connection";
import { review } from "@/db/postgresql/schema/review";
import { CustomRequest } from "@/types/custom";
import { errRes } from "@/utils/error";
import { PostReviewReqSchema } from "@/types/controllers/reviewReq";
import { user } from "@/db/postgresql/schema/user";
import { eq } from "drizzle-orm";

export const postReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const postReviewReq = PostReviewReqSchema.safeParse(req.body);
    if (!postReviewReq.success) {
      return errRes(res, 400, `invalid data for posting review, ${postReviewReq.error.toString()}`);
    }

    const data = postReviewReq.data;

    await db.insert(review).values({ reviewText: data.reviewText, userId: userId2 });

    return res.status(200).json({
      success: true,
      message: "review posted",
    });
  } catch (error) {
    return errRes(res, 500, "error while posting review");
  }
};

export const getReviews = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const reviews = await db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        reviewText: review.reviewText,
      })
      .from(review)
      .innerJoin(user, eq(user.id, review.userId))
      .where(eq(review.approved, true))
      .limit(25);

    return res.status(200).json({
      success: true,
      message: "review posted",
      reviews: reviews,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting reviews");
  }
};
