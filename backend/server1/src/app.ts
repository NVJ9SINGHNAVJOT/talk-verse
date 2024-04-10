import express, { Express } from 'express';
import authRoutes from '@/routes/Auth';
import { mongodbdatabaseConnect } from '@/db/mongodb/mongodb';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

const app: Express = express();

mongodbdatabaseConnect().catch(console.dir);
import '@/db/postgresql/postgresql';

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

app.use('/api/server1/v1/auth', authRoutes);

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is up and running.'
    });
});

export default app;
