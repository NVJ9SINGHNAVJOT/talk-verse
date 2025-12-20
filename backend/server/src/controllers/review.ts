import { Request, Response } from "express";
import { db } from "@/db/postgresql/connection";
import { reviews } from "@/db/postgresql/schema/reviews";
import { CustomRequest } from "@/types/custom";
import { errRes } from "@/utils/error";
import { PostReviewReqSchema } from "@/types/controllers/reviewReq";
import { users } from "@/db/postgresql/schema/users";
import { eq } from "drizzle-orm";

export const postReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const postReviewReq = PostReviewReqSchema.safeParse(req.body);
    if (!postReviewReq.success) {
      return errRes(res, 400, `invalid data for posting review, ${postReviewReq.error.message}`);
    }

    const data = postReviewReq.data;

    await db.insert(reviews).values({ reviewText: data.reviewText, userId: userId2 });

    return res.status(200).json({
      success: true,
      message: "review posted",
    });
  } catch (error) {
    return errRes(res, 500, "error while posting review", error);
  }
};

export const getReviews = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const reviewsList = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        reviewText: reviews.reviewText,
      })
      .from(reviews)
      .innerJoin(users, eq(users.id, reviews.userId))
      .where(eq(reviews.approved, true))
      .limit(25);

    return res.status(200).json({
      success: true,
      message: "review posted",
      reviews: reviewsList,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting reviews", error);
  }
};
