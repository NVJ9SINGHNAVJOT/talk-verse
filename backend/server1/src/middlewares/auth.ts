import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
import { errRes } from "@/utils/error";
import { logger } from "@/logger/logger";
configDotenv();

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