import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { Request } from "express";

export interface CustomPayload extends JwtPayload {
    userId?: string;
}

export interface CustomRequest extends Request {
    userId: string;
    userId2?: number;
}

export interface CustomSocket extends Socket {
    userId: string;
}