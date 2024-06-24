import { createLogger, format, transports } from "winston";

const productionLogger = () => {
  return createLogger({
    transports: [
      // printed on console
      new transports.Console({
        level: "error",
        format: format.combine(
          format.json(),
          format.prettyPrint(),
          format.colorize(),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ timestamp, level, message, ...args }) => {
            return `[${timestamp}] ${level}: ${message}. data: ${JSON.stringify(args)}`;
          })
        ),
      }),
    ],
    // silent: true,
  });
};

export default productionLogger;
