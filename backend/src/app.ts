import express, { Express } from 'express';
import userRoutes from '@/routes/UserRoutes';
import { mongodbdatabaseConnect } from '@/config/mongodb';
import { cloudinaryConnect } from '@/config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

const app: Express = express();

mongodbdatabaseConnect();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
}));

cloudinaryConnect();

app.use('/api/v1/auth', userRoutes);

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is up and running.'
    });
});

export default app;
