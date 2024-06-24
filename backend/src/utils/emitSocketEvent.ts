import { logger } from "@/logger/logger";
import {
  SoAddedInGroup,
  SoGroupMessageRecieved,
  SoMessageRecieved,
  SoRequestAccepted,
  SoUserRequest,
} from "@/types/socket/eventTypes";
import { Request } from "express";

const emitSocketEvent = (
  req: Request,
  roomIds: string[],
  event: string,
  // sdata can be only be of type data send to client by client events
  sdata: string | SoUserRequest | SoRequestAccepted | SoAddedInGroup | SoMessageRecieved | SoGroupMessageRecieved
) => {
  if (roomIds.length === 0) {
    throw new Error("no socketIds present in parameter roomIds");
    return;
  }
  try {
    req.app.get("io").to(roomIds).emit(event, sdata);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while emiting event from io", { error: error, data: sdata });
  }
};

export default emitSocketEvent;
