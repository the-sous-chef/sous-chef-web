declare namespace App {
    export type AllowedEnvironments = 'production' | 'development';

    export type Config = App.DefaultConfig & {
        backlog: number;
        hostname: string;
        port: number;
        proxy?: boolean;
        compress?: import('koa-compress').CompressOptions;
        appName: string;
        defaultCulture: string;
        environment: App.AllowedEnvironments;
        deployment: string;
        auth0: App.Auth0Config;
        firebase: App.FirebaseConfig;
        services: {
            gateway: App.ServiceConfig;
        }
    };

    export type Auth0Config = {
        clientId: string;
        domain: string;
    };

    export type Credentials = import('@auth0/auth0-spa-js').User & {
        firebaseCredentials?: import('@firebase/auth-types').OAuthCredential;
    };

    export interface DefaultConfig {
        [key: string]: string | number | boolean;
    }

    export type FirebaseConfig = {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    };

    export type ServiceConfig = import('ky').Options & {
        prefixUrl: string;
    }
}
