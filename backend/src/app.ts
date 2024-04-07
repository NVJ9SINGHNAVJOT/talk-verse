import express, { Express } from 'express';
import userRoutes from './routes/User';
import { mongodbdatabaseConnect } from './config/mongodb';
import { cloudinaryConnect } from './config/cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app: Express = express();

mongodbdatabaseConnect();
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
}));

app.use('/api/v1/auth', userRoutes);

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is up and running.'
    });
});

export default app;
