import { logger } from "@/logger/logger";
import { errRes } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

function serverKey(req: Request, res: Response, next: NextFunction) {
    try {
        const serverKey = req.header("Authorization")?.replace("Bearer ", "");
        if (serverKey === process.env['SERVER_KEY'] as string) {
            next();
        }
        else {
            logger.error('unauthorized access denied for server', { ip: req.ip, serverKey: serverKey });
            return errRes(res, 401, "unauthorized access denied for server");
        }
    } catch (error) {
        return errRes(res, 401, "errror while checking authorization of serverKey");
    }
}

export default serverKey;