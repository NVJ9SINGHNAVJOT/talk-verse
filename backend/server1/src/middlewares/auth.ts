import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
import { errRes } from "@/utils/error";
import { logger } from "@/logger/logger";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import User from "@/db/mongodb/models/User";
import Token from "@/db/mongodb/models/Token";

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

// interface for authentication for user
interface CustomRequest extends Request {
    userId?: string;
}
interface CustomPayload extends JwtPayload {
    userId?: string;
}
// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token =
            req.cookies.userTalkverseToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return errRes(res, 401, "user no logged in");
        }

        // check token exist in database or expired or invalid token
        const checkToken = await Token.find({ tokenValue: token }).exec();
        if (checkToken.length !== 1) {
            return errRes(res, 401, "user token is invalid");
        }

        // decode token
        const decoded: CustomPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // check user again with decode token data (decoded data contain userid)
        const checkUser = await User.find({ _id: decoded.userId }).select({ email: true }).exec();
        if (checkUser.length !== 1) {
            return errRes(res, 400, "authorization failed for user");
        }

        // user verified and now userid is set in request
        (req as CustomRequest).userId = decoded.userId;
        next();

        return errRes(res, 401, "user authorization failed");

    } catch (error) {
        return errRes(res, 500, "user authorization failed");
    }
};