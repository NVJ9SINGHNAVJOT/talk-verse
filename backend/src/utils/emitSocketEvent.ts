import { logger } from '@/logger/logger';
import { Request } from 'express';

const emitSocketEvent = (req: Request, event: string, sdata: unknown, roomId?: string | null, roomIds?: string[]) => {
    try {
        if (roomId) {
            req.app.get("io").to(roomId).emit(event, sdata);
        }
        else {
            req.app.get("io").to(roomIds).emit(event, sdata);
        }
    } catch (error) {
        logger.error('error while emiting event from io', { error: error, data: sdata });
    }
};

export default emitSocketEvent;