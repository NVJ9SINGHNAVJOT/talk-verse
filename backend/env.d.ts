declare namespace NodeJS {
    export interface ProcessEnv {
        ENVIRONMENT: "development" | "production" | "test";
        SERVER_KEY: string;
        PORT: string;

        MAIL_HOST: string;
        MAIL_USER: string;
        MAIL_PASS: string;

        JWT_SECRET: string;
        TOKEN_NAME: string;

        FOLDER_NAME: string;
        CLOUD_NAME: string;
        API_KEY: string;
        API_SECRET: string;

        MONGODB_URL: string;

        POSTGRESQL_HOST: string;
        POSTGRESQL_PORT: string;
        POSTGRESQL_USER: string;
        POSTGRESQL_PASSWORD: string;
        POSTGRESQL_DATABASE_NAME: string;
        POSTGRESQL_CONNECTION_URL: string;
    }
}