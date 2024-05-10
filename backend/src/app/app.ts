import { Request, Response } from "express"
import express, { Express } from 'express';
import { mongodbdatabaseConnect } from '@/db/mongodb/connection';
import '@/db/postgresql/connection';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import apiKey from "@/middlewares/apiKey";
import authRoutes from '@/routes/authRoutes';
import notificationRoutes from '@/routes/notificationRoutes';
import chatRoutes from '@/routes/chatRoutes';
import corsOptions from "@/config/corsOptions";

configDotenv();

const app: Express = express();

mongodbdatabaseConnect().catch(() => {
    console.log("mongodb connection failed");
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// server only accessible with key
app.use(apiKey);

// connect cloudinary
cloudinaryConnect();

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/chat', chatRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'server is up and running.'
    });
});

export default app;
