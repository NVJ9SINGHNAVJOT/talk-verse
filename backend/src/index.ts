import dotenv from 'dotenv';
import consoleConfig from "@/config/console";
import { loggerConfig } from '@/logger/logger';
import app from '@/app/app';
import { setupWebSocket } from '@/socket/index';
import setup from '@/socket/setup';

dotenv.config();
consoleConfig();
loggerConfig(process.env.ENVIRONMENT as string);

async function main() {
    const PORT: number = parseInt(process.env.PORT as string) || 5000;
    const httpServer = setupWebSocket(app);
    await setup();
    httpServer.listen(PORT, () => {
        console.log(`server running...`);
    });
}

main();