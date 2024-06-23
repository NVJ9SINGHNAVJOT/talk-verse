import { createLogger } from "winston";

/* NOTE: currently no logger configurations are provided for production */
const productionLogger = () => {
  return createLogger({
    silent: true,
  });
};

export default productionLogger;
