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