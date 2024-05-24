import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
import { errRes } from "@/utils/error";
import { CustomRequest } from "@/types/custom";
import { jwtVerify } from "@/utils/token";
import fs from 'fs';
configDotenv();

// user token authorization and checked with database
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting JWT from request cookies or header
        const token = req.cookies[process.env.TOKEN_NAME as string];

        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            if (req.file && fs.existsSync(req.file.path)) {
                await fs.promises.unlink(req.file.path);
            }
            return errRes(res, 401, "user authorization failed, no token present");
        }

        const userId = await jwtVerify(token);

        if (!userId) {
            if (req.file && fs.existsSync(req.file.path)) {
                await fs.promises.unlink(req.file.path);
            }
            return errRes(res, 401, "user token invalid, need to log in");
        }

        // user verified and now userid is set in request
        (req as CustomRequest).userId = userId;
        next();
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            await fs.promises.unlink(req.file.path);
        }
        return errRes(res, 500, "user authorization failed");
    }
};