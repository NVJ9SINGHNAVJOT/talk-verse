import { logger } from "@/logger/logger";
import { errRes } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

function logging(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('req details', {
            method: req.method,
            url: req.url,
            clientIP: req.ip,
            requestBody: req.body,
            requestHeaders: req.headers
        });
        next();
    } catch (error) {
        return errRes(res, 500, "errror while logging req details");
    }
}

export default logging;