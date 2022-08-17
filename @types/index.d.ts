declare namespace App {
    export type ClientConfig = App.ConfigLike;

    export type ServerConfig = App.ConfigLike & {
        backlog: number;
        caching?: {
            maxAge: number;
        },
        hostname: string;
        port: number;
        proxy?: boolean;
        compress?: import('koa-compress').CompressOptions;
        appName: string;
        defaultLocale: string;
        auth0: App.Auth0Config;
    };

    export type ServicesConfig = App.ConfigLike & {
        gateway: App.ServiceConfig;
    };

    export type Auth0Config = {
        clientId: string;
        domain: string;
    };

    // export type Credentials = import('@auth0/auth0-spa-js').User;

    export interface ConfigLike {
        [key: string]: string | number | boolean;
    }

    export type ServiceConfig = import('ky').Options & {
        prefixUrl: string;
    }

    export type Logger = import('pino').Logger;

    export type TemplateConfig = {
        development: boolean;
        devServer: {
            hostname: string;
            port: number;
        };
        manifest: import('vite').Manifest;
        publicPath: string;
    };

    export type ServerContext = import('koa').DefaultContext & {
        config: ServerConfig;
    }

    export type ServerState = import('koa').DefaultState & {
        locale: string;
    };
}
