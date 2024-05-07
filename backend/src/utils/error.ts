import { logger } from '@/logger/logger';
import { Response } from 'express';

export function errRes(res: Response, status: number, message: string, error?: unknown):
    Response<unknown, Record<string, unknown>> {
    // log internal server error
    if (error) {
        logger.error(message, { status: status, error: error });
    }
    return res.status(status).json({
        success: false,
        message: message
    });
}