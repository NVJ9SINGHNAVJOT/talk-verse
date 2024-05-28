import { Request, Response, NextFunction } from "express";
import { errRes } from "@/utils/error";
import { CustomRequest } from "@/types/custom";
import { jwtVerify } from "@/utils/token";

// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token = req.cookies[process.env.TOKEN_NAME as string];

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return errRes(res, 401, "user authorization failed, no token present");
        }

        const userIds = await jwtVerify(token);

        if (!userIds || userIds.length !== 2) {
            return errRes(res, 401, "user token invalid, need to log in");
        }

        (req as CustomRequest).userId = userIds[0] as string;
        (req as CustomRequest).userId2 = userIds[1] as number;

        next();
    } catch (error) {
        return errRes(res, 500, "user authorization failed", error);
    }
};