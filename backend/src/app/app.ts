import { Request, Response } from "express"
import express, { Express } from 'express';
import { mongodbdatabaseConnect } from '@/db/mongodb/connection';
import '@/db/postgresql/connection';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import serverKey from "@/middlewares/serverKey";
import authRoutes from '@/routes/authRoutes';
import notificationRoutes from '@/routes/notificationRoutes';
import chatRoutes from '@/routes/chatRoutes';
import profileRoutes from "@/routes/profileRoutes";
import postRoutes from "@/routes/postRoutes";
import postDataRoutes from "@/routes/postDataRoutes";
import corsOptions from "@/config/corsOptions";
import logging from "@/middlewares/logging";
import { logger } from "@/logger/logger";

const app: Express = express();

mongodbdatabaseConnect().catch(() => {
    logger.info("mongodb connection failed");
});

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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/postData', postDataRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'server is up and running.'
    });
});

export default app;
