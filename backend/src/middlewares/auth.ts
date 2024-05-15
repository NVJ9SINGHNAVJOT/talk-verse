import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
import { errRes } from "@/utils/error";
import { CustomRequest } from "@/types/custom";
import { jwtVerify } from "@/utils/token";

configDotenv();

// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token =
            req.cookies[process.env.TOKEN_NAME as string] ||
            req.header("Authorization")?.replace("Bearer ", "");

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return errRes(res, 401, "user authorization failed, no token present");
        }

        const userId = await jwtVerify(token);

        if (!userId) {
            return errRes(res, 401, "user not logged in");
        }

        // user verified and now userid is set in request
        (req as CustomRequest).userId = userId;
        next();
    } catch (error) {
        return errRes(res, 500, "user authorization failed");
    }
};