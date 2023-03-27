declare namespace App {
    export type Env = {
        APP_CONFIG_APP_IDENTIFIER: string;
        APP_CONFIG_CLIENT_CONFIG_PROFILE_IDENTIFIER: string;
        APP_CONFIG_SERVER_CONFIG_PROFILE_IDENTIFIER: string;
        AWS_REGION: string;
        AUTH0_CALLBACK_URL: string;
        AUTH0_CLIENT_ID: string;
        AUTH0_CLIENT_SECRET: string;
        AUTH0_DOMAIN: string;
        AUTH0_LOGOUT_URL: string;
        AUTH0_RETURN_TO_URL: string;
        DEBUG_BUILD: boolean;
        ENVIRONMENT: string;
        LOGROCKET_ACCOUNT_ID: string;
        SECRETS: string;
        SENTRY_DSN: string;
    };
}
