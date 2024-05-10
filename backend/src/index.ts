import dotenv from 'dotenv';
import consoleConfig from "@/config/console";
import { loggerConfig } from '@/logger/logger';
import app from '@/app/app';
import { setupSocketIO } from '@/socket/index';
import setup from '@/socket/setup';

dotenv.config();
consoleConfig();
loggerConfig(process.env.ENVIRONMENT as string);

async function main() {
    const PORT: number = parseInt(process.env.PORT as string) || 5000;
    const httpServer = setupSocketIO(app);
    await setup();
    httpServer.listen(PORT, () => {
        console.log(`server running...`);
    });
}

main();