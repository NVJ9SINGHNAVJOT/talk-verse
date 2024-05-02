import { logger } from "@/logger/logger";
import { errRes } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

function apiKey(req: Request, res: Response, next: NextFunction) {
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
        return errRes(res, 401, "errror while checking authorization of apikey");
    }
}

export default apiKey;