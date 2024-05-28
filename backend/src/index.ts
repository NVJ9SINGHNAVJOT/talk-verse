// initialization for server
import dotenv from 'dotenv';
dotenv.config();
import consoleConfig from "@/config/console";
consoleConfig();
import { logger, loggerConfig } from '@/logger/logger';
loggerConfig(process.env.ENVIRONMENT as string);

// setup server config
import app from '@/app/app';
import { setupWebSocket } from '@/socket/index';
import setupChannels from '@/socket/setupChannels';
import { mongodbDatabaseConnect } from '@/db/mongodb/connection';
import { postgresqlDatabaseConnect } from '@/db/postgresql/connection';

async function main() {
    // connect databases
    await mongodbDatabaseConnect();
    await postgresqlDatabaseConnect();

    // get port number
    const PORT: number = parseInt(process.env.PORT as string) || 5000;
    
    // setup server
    const httpServer = setupWebSocket(app);

    // setup channels for messages
    await setupChannels();

    httpServer.listen(PORT, () => {
        logger.info("server running...");
    });
}

main();