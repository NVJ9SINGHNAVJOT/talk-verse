import { db } from '@/db/postgresql/connection';
import { user } from '@/db/postgresql/schema/user';
import { CustomRequest } from '@/types/custom';
import { errRes } from '@/utils/error';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

export const userBlogProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId2 = (req as CustomRequest).userId2;

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const blogProfile = await db.select({ followingCount: user.followingCount, followersCount: user.followersCount })
            .from(user).where(eq(user.id, userId2)).limit(1).execute();

        if (blogProfile.length !== 1) {
            return errRes(res, 400, "userId2 not present in database");
        }

        return res.status(200).json({
            success: true,
            message: "user blog profile data",
            blogProfile: blogProfile[0]
        });

    } catch (error) {
        return errRes(res, 500, "error while getting chatbar data", error);
    }
};