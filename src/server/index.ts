// import 'newrelic';
import * as Sentry from '@sentry/node';
import { CaptureConsole, Debug } from '@sentry/integrations';
import '@sentry/tracing';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-pino-logger';
import { locale } from 'src/server/middleware/locale';
import { setCacheHeader } from 'src/server/middleware/cacheHeaders';
import { error } from 'src/server/middleware/error';
import { getLogger } from 'src/shared/logger';
import { killHandler } from 'src/server/utils/killHandler';
import { router } from 'src/server/router';
import { getServerConfig } from 'src/server/utils/config';
import { sentry } from 'src/server/middleware/sentry';
import { handleError } from 'src/server/utils/handleError';

const LOGGER = getLogger();

Sentry.init({
    autoSessionTracking: true,
    debug: process.env.NODE_ENV !== 'production',
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEPLOYMENT,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new CaptureConsole(),
        process.env.NODE_ENV === 'development' ? new Debug() : null,
    ].filter(Boolean) as Sentry.NodeOptions['integrations'],
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
    tracesSampleRate: 1.0,

});

let app: App.Server;

const stop = (): void => {
    Sentry.close(2000).then(() => {
        if (app?.server) {
            app.server.close();
        }
    });
};

try {
    app = new Koa<App.ServerState, App.ServerContext>();
    app.silent = true;

    // pm2 graceful shutdown compatibility
    // Catches ctrl+c event
    process.on('SIGINT', killHandler(LOGGER, stop));

    // atexit handler
    process.on('exit', stop);

    // Centralized logging. Anytime the `error` event is called on the app
    // (i.e. when app.error is called), make sure that the
    // error is logged
    app.on('error', handleError);
    app.context.config = await getServerConfig();

    const {
        backlog,
        hostname,
        port,
        proxy,
    } = app.context.config;

    app.proxy = !!proxy;

    app.use(error);
    app.use(sentry());
    app.use(locale);
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(logger());
    app.use(compress(app.context.config.compress));
    app.use(cors({ origin: '*' }));
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(setCacheHeader(app.context.config.caching?.maxAge));

    app.server = app.listen(
        port,
        hostname,
        backlog,
        () => {
            if (process.send) {
                process.send('ready');
            }
            LOGGER.info(`Server listening at ${hostname}:${port}...`);
        },
    );
} catch (e) {
    stop();
}

// import('src/server/main').then((m) => {
//     const server = new m.Server();

//     server.start();
// }).catch((e) => Sentry.captureException(e));
