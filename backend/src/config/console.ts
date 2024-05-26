
const consoleConfig = () => {
    if (process.env.ENVIRONMENT as string !== "development") {
        console.log = function () { };
        console.debug = function () { };
        console.info = function () { };
        console.warn = function () { };
        console.error = function () { };
    }
};

export default consoleConfig;