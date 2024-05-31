// initialization environment for server
import dotenv from 'dotenv';
dotenv.config();
// check environment variables
checkEnvVariables();

// setup server config
import { logger, loggerConfig } from '@/logger/logger';
import app from '@/app/app';
import { setupWebSocket } from '@/socket/index';
import setupChannels from '@/socket/setupChannels';
import { mongodbDatabaseConnect } from '@/db/mongodb/connection';
import { postgresqlDatabaseConnect } from '@/db/postgresql/connection';
import { checkEnvVariables, envVar } from '@/validators/checkEnvVariables';

async function main() {
    // setup logger
    loggerConfig(envVar.ENVIRONMENT);

    // connect databases
    await mongodbDatabaseConnect();
    await postgresqlDatabaseConnect();

    // get port number
    const PORT = parseInt(envVar.PORT) || 5000;

    // setup server
    const httpServer = setupWebSocket(app);

    // setup channels for messages
    await setupChannels();

    httpServer.listen(PORT, () => {
        logger.info("server running...");
    });
}

main();