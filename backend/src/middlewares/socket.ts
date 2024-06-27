import { Socket } from "socket.io";
import { CustomSocket } from "@/types/custom";
import { jwtVerify } from "@/utils/token";
import { logger } from "@/logger/logger";

// check authentication for socket
export const checkUserSocket = async (socket: Socket): Promise<boolean> => {
  try {
    logger.http("socket req details", {
      socketId: socket.id,
      method: socket.request.method,
      url: socket.request.url,
      requestHeaders: {
        authorization: socket.request.headers.authorization,
      },
    });

    const serverKey = socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!serverKey || serverKey !== `${process.env["SERVER_KEY"]}`) {
      return false;
    }

    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) {
      return false;
    }

    const splitCookies = rawCookies?.split("; ");
    const parsedCookies: Record<string, string> = {};

    splitCookies.forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts[0] && parts[1]) {
        parsedCookies[parts[0]] = parts[1];
      }
    });

    // Extract the token value
    const token = parsedCookies[`${process.env["TOKEN_NAME"]}`];

    if (!token) {
      return false;
    }

    const userIds = await jwtVerify(token);

    if (!userIds || userIds.length !== 2) {
      return false;
    }

    // user verified and now userid is set in request
    (socket as CustomSocket).userId = userIds[0] as string;

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while checking socket authorization", { socketId: socket.id });
    return false;
  }
};
