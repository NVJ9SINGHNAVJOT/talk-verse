import { logger } from "@/logger/logger";
import { errRes } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

function logging(req: Request, res: Response, next: NextFunction) {
  try {
    logger.http("req details", {
      method: req.method,
      url: req.url,
      clientIP: req.ip,
      query: req.query,
      requestBody: req.body,
      requestHeaders: {
        "content-type": req.headers["content-type"],
      },
    });
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "errror while logging req details");
  }
}

export default logging;
