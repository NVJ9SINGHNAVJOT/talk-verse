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
  try {
    req.app.get("io").to(roomIds).emit(event, sdata);
  } catch (error) {
    logger.error("error while emiting event from io", { error: error, data: sdata });
  }
};

export default emitSocketEvent;
