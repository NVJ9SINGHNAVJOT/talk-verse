import { Request, Response } from "express"
import express, { Express } from 'express';
import authRoutes from '@/routes/authRoutes';
import { mongodbdatabaseConnect } from '@/db/mongodb/connection';
import '@/db/postgresql/connection';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { authKey } from '@/middlewares/auth';
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


cloudinaryConnect();

app.use('/server1/api/v1/auth', authKey, authRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'server1 is up and running.'
    });
});

export default app;
