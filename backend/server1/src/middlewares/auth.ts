import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
import { errRes } from "@/utils/error";
import { logger } from "@/logger/logger";
import { CustomRequest } from "@/types/custom";
import { jwtVerify } from "@/utils/token";

configDotenv();

// api key checked with frontend server call
export const authKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.header("Api_Key");
        if (apiKey === process.env.SERVER1_KEY as string) {
            next();
        }
        else {
            logger.error("unauthorized access denied");
            return errRes(res, 401, "unauthorized access denied");
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "errror while checking authorization of apikey"
        });
    }
};

// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token =
            req.cookies[process.env.TOKEN_NAME as string] ||
            req.header("Authorization")?.replace("Bearer ", "");

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return errRes(res, 401, "user not logged in");
        }

        const userId = await jwtVerify(token);

        if (!userId) {
            return errRes(res, 400, "user authorization failed");
        }

        // user verified and now userid is set in request
        (req as CustomRequest).userId = userId;
        next();
    } catch (error) {
        return errRes(res, 500, "user authorization failed");
    }
};