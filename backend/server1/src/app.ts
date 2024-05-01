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

configDotenv();

const app: Express = express();

app.use("/uploads", express.static("uploads"));

mongodbdatabaseConnect().catch(() => {
    console.log("mongodb connection failed");
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["PUT", "PATCH", "POST", "GET", "DELETE"]
}));

// server only accessible with key
app.use(apiKey);

// connect cloudinary
cloudinaryConnect();

// routes
app.use('/server1/api/v1/auth', authRoutes);
app.use('/server1/api/v1/notification', notificationRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'server1 is up and running.'
    });
});

export default app;
