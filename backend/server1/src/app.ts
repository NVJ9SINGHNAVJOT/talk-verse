import express, { Express } from 'express';
import authRoutes from '@/routes/authRoutes';
import { mongodbdatabaseConnect } from '@/db/mongodb/mongodb';
import '@/db/postgresql/postgresql';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { configDotenv } from 'dotenv';

configDotenv();

const app: Express = express();

mongodbdatabaseConnect().catch(console.dir);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
}));

cloudinaryConnect();

const apiKey = process.env.SERVER1_KEY as string;

app.use(`/api/server1/v1/${apiKey}/auth`, authRoutes);

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'server1 is up and running.'
    });
});

export default app;
