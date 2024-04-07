import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '@/models/User';


// Signup Controller for Registering Users
export const signup = async (req: Request, res: Response): Promise<Response> => {
  req.body.value;
  return res.status(200).json({ success: true, message: "response send" });
};