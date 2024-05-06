import { Request } from 'express';

const emitSocketEvent = (req: Request, event: string, roomId?: string, roomIds?: string[]) => {
    if (roomId) {
        req.app.get("io").to(roomIds).emit(event);
    }
    else {
        req.app.get("io").to(roomIds).emit(event);
    }
};

export default emitSocketEvent;