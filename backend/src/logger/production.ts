import { createLogger, transports, format } from "winston";

const productionLogger = () => {
    return createLogger({
        transports: [new transports.Http()],
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.json(),
        ),
    });
};

export default productionLogger;