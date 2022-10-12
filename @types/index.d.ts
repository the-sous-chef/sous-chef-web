declare namespace App {
    export type ClientConfig = App.ConfigLike;

    export type ServerConfig = App.ConfigLike & {
        abortDelay: number;
        backlog: number;
        caching?: {
            maxAge: number;
        },
        hostname: string;
        port: number;
        proxy?: boolean;
        publicPath: string;
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

    export type RenderContext = {
        development: boolean;
        devServer: {
            hostname: string | undefined;
            port: number | undefined;
        };
        dehydratedState: import('@tanstack/react-query').DehydratedState;
        manifest: import('vite').Manifest;
        publicPath: string;
    };

    export type ServerContext = import('koa').DefaultContext & {
        config: ServerConfig;
    }

    export type ServerState = import('koa').DefaultState & {
        locale: string;
        transaction: ReturnType<import('@sentry/node').Hub['startTransaction']>;
    };

    export type Server = import('ky').Koa<App.ServerState, App.ServerContext> & { server: ReturnType<import('ky').Koa['listen']> }
}
