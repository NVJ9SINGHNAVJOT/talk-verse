import { Request, Response } from 'express';


// create user
export const signUp = async (_req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ success: true, message: "response send" });
};