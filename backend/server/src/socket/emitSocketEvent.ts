import { logger } from "@/logger/logger";
import { _io } from "@/socket";
import {
  SoAddedInGroup,
  SoGroupMessageRecieved,
  SoMessageRecieved,
  SoRequestAccepted,
  SoUserRequest,
} from "@/types/socket/eventTypes";

const emitSocketEvent = (
  roomIds: string[],
  event: string,
  // sdata can be only be of type data send to client by client events
  sdata: string | SoUserRequest | SoRequestAccepted | SoAddedInGroup | SoMessageRecieved | SoGroupMessageRecieved
) => {
  if (roomIds.length === 0) {
    logger.error("no socketIds present in parameter roomIds", { event: event, data: sdata });
    return;
  }
  try {
    _io.to(roomIds).emit(event, sdata);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while emiting event from io", { error: error.message, data: sdata });
  }
};

export default emitSocketEvent;
