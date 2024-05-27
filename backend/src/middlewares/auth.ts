import { Request, Response, NextFunction } from "express";
import { errRes } from "@/utils/error";
import { CustomRequest } from "@/types/custom";
import { jwtVerify } from "@/utils/token";
import { db } from "@/db/postgresql/connection";
import { user } from "@/db/postgresql/schema/user";
import { eq } from "drizzle-orm";

// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token = req.cookies[process.env.TOKEN_NAME as string];

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return errRes(res, 401, "user authorization failed, no token present");
        }

        const userId = await jwtVerify(token);

        if (!userId) {
            return errRes(res, 401, "user token invalid, need to log in");
        }

        (req as CustomRequest).userId = userId;

        next();
    } catch (error) {
        return errRes(res, 500, "user authorization failed", error);
    }
};

// authenticaton for only postgreSQL database, this is only used for routes which uses postgreSQL database
export const auth2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "userId not present for authentication of userId2");
        }

        const userId2 = await db
            .select({ userId2: user.id })
            .from(user)
            .where(eq(user.refId, userId))
            .limit(1)
            .execute();

        if (!userId2 || userId2.length !== 1 || !userId2[0]) {
            return errRes(res, 400, 'user authorization failed, userId2 is not found for userId');
        }

        (req as CustomRequest).userId2 = userId2[0].userId2;
        next();

    } catch (error) {
        return errRes(res, 500, "user authorization failed for userId2", error);
    }
};