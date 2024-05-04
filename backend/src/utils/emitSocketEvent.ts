import { Request } from 'express';

const emitSocketEvent = (req: Request, event: string, payload: string, roomId?: string, roomIds?: string[]) => {
    if (roomId) {
        req.app.get("io").to(roomIds).emit(event, payload);
    }
    else {
        req.app.get("io").to(roomIds).emit(event, payload);
    }
};

export default emitSocketEvent;