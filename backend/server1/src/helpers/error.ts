import { Response } from 'express';

export function sendJsonResponse(res: Response, status: number, message: string):
    Response<unknown, Record<string, unknown>> {
    return res.status(status).json({
        success: false,
        message: message
    });
}