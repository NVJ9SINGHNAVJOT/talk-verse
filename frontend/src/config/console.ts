export default function consoleConfig(environment: string | undefined): void {
    if (environment !== "development") {
        console.log = function () { };
        console.debug = function () { };
        console.info = function () { };
        console.warn = function () { };
        console.error = function () { };
    }
}