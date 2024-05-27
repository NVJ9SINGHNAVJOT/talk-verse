// initialization for server
import dotenv from 'dotenv';
dotenv.config();
import consoleConfig from "@/config/console";
consoleConfig();
import { logger, loggerConfig } from '@/logger/logger';
loggerConfig(process.env.ENVIRONMENT as string);

// setup server
import app from '@/app/app';
import { setupWebSocket } from '@/socket/index';
import setup from '@/socket/setup';

async function main() {
    const PORT: number = parseInt(process.env.PORT as string) || 5000;
    const httpServer = setupWebSocket(app);
    await setup();
    httpServer.listen(PORT, () => {
        logger.info("server running...");
    });
}

main();