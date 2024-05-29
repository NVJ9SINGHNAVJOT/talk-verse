import { Request, Response } from "express"
import express, { Express } from 'express';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import serverKey from "@/middlewares/serverKey";
import authRoutes from '@/routes/authRoutes';
import notificationRoutes from '@/routes/notificationRoutes';
import chatRoutes from '@/routes/chatRoutes';
import profileRoutes from "@/routes/profileRoutes";
import postRoutes from "@/routes/postRoutes";
import corsOptions from "@/config/corsOptions";
import logging from "@/middlewares/logging";

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// connect cloudinary
cloudinaryConnect();

// logging details
app.use(logging);

// server only accessible with serverKey
app.use(serverKey);

// routes
app.use('/api/v1/auths', authRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/posts', postRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'server is up and running.'
    });
});

export default app;
