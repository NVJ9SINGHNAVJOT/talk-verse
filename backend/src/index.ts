import dotenv from 'dotenv';
import consoleConfig from "@/config/console";
import { loggerConfig } from '@/logger/logger';
import app from '@/app';
import { setupSocketIO } from '@/socket/index';

dotenv.config();
consoleConfig();
loggerConfig(process.env.ENVIRONMENT as string);

const PORT: number = parseInt(process.env.PORT as string) || 5000;

const httpServer = setupSocketIO(app);
httpServer.listen(PORT, () => {
    console.log(`server running...`);
});