import { logger } from "@/logger/logger";
import { errRes } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

function logging(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('req details', {
            method: req.method,
            url: req.url,
            clientIP: req.ip,
            query: req.query,
            requestBody: req.body,
            requestHeaders: {
                "content-type": req.headers["content-type"],
            },
            file: req.file ? {
                path: req.file.path, size: req.file.size, name: req.file.filename,
                field: req.file.fieldname, originalname: req.file.originalname
            } : ""
        });
        next();
    } catch (error) {
        return errRes(res, 500, "errror while logging req details");
    }
}

export default logging;