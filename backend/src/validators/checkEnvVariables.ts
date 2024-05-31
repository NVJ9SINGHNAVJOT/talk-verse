export function checkEnvVariables() {
    if (
        !process.env['ENVIRONMENT'] ||
        !process.env['SERVER_KEY'] ||
        !process.env['PORT'] ||

        !process.env['MAIL_HOST'] ||
        !process.env['MAIL_USER'] ||
        !process.env['MAIL_PASS'] ||

        !process.env['JWT_SECRET'] ||
        !process.env['TOKEN_NAME'] ||

        !process.env['FOLDER_NAME'] ||
        !process.env['CLOUD_NAME'] ||
        !process.env['API_KEY'] ||
        !process.env['API_SECRET'] ||

        !process.env['MONGODB_URL'] ||

        !process.env['POSTGRESQL_HOST'] ||
        !process.env['POSTGRESQL_PORT'] ||
        !process.env['POSTGRESQL_USER'] ||
        !process.env['POSTGRESQL_PASSWORD'] ||
        !process.env['POSTGRESQL_DATABASE_NAME']
    ) {
        process.exit();
    }
}

export const envVar = {
    ENVIRONMENT: `${process.env['ENVIRONMENT']}` as string,
    SERVER_KEY: `${process.env['SERVER_KEY']}` as string,
    PORT: `${process.env['PORT']}` as string,

    MAIL_HOST: `${process.env['MAIL_HOST']}` as string,
    MAIL_USER: `${process.env['MAIL_USER']}` as string,
    MAIL_PASS: `${process.env['MAIL_PASS']}` as string,

    JWT_SECRET: `${process.env['JWT_SECRET']}` as string,
    TOKEN_NAME: `${process.env['TOKEN_NAME']}` as string,

    FOLDER_NAME: `${process.env['FOLDER_NAME']}` as string,
    CLOUD_NAME: `${process.env['CLOUD_NAME']}` as string,
    API_KEY: `${process.env['API_KEY']}` as string,
    API_SECRET: `${process.env['API_SECRET']}` as string,

    MONGODB_URL: `${process.env['MONGODB_URL']}` as string,

    POSTGRESQL_HOST: `${process.env['POSTGRESQL_HOST']}` as string,
    POSTGRESQL_PORT: `${process.env['POSTGRESQL_PORT']}` as string,
    POSTGRESQL_USER: `${process.env['POSTGRESQL_USER']}` as string,
    POSTGRESQL_PASSWORD: `${process.env['POSTGRESQL_PASSWORD']}` as string,
    POSTGRESQL_DATABASE_NAME: `${process.env['POSTGRESQL_DATABASE_NAME']}` as string,
};