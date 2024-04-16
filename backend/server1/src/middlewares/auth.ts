import { Request, Response, NextFunction } from "express";
import { configDotenv } from "dotenv";
configDotenv();

export const authKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers["apiKey"];

        if (apiKey === process.env.SERVER1_KEY as string) {
            next();
        }
        else {
            return res.status(500).json({
                success: false,
                message: "authKey not matched"
            });
        }
    } catch (error) {
        console.log("error in while matching autkey", error);
        return res.status(500).json({
            success: false,
            message: "errror while matching authkey"
        });
    }
};