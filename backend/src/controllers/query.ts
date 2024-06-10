import { db } from "@/db/postgresql/connection";
import { query } from "@/db/postgresql/schema/query";
import { SendQueryReqSchema } from "@/types/controllers/queryReq";
import { errRes } from "@/utils/error";
import { Request, Response } from "express";

export const sendQuery = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sendQueryReq = SendQueryReqSchema.safeParse(req.body);

    if (!sendQueryReq.success) {
      return errRes(res, 400, `invalid data for sending query, ${sendQueryReq.error.toString()}`);
    }

    const data = sendQueryReq.data;

    await db.insert(query).values({ fullName: data.fullName, emailId: data.email, queryText: data.text });

    return res.status(200).json({
      success: true,
      message: "query send successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while save query", error);
  }
};
