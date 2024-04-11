import app from '@/app';
import { setupSocketIO } from '@/socket/index';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = parseInt(process.env.PORT as string) || 4000;

const httpServer = setupSocketIO(app);
httpServer.listen(PORT, () => {
    console.log(`server1 running...`);
});
