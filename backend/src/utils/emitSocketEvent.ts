import { Request } from 'express';

const emitSocketEvent = (req: Request, event: string, sdata: object, roomId?: string | null, roomIds?: string[]) => {
    if (roomId) {
        req.app.get("io").to(roomIds).emit(event, sdata);
    }
    else {
        req.app.get("io").to(roomIds).emit(event, sdata);
    }
};

export default emitSocketEvent;