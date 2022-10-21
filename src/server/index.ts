// import 'newrelic';
// eslint-disable-next-line import/extensions
import 'source-map-support/register.js';
import * as Sentry from '@sentry/node';
import { CaptureConsole, Debug } from '@sentry/integrations';
import '@sentry/tracing';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import Koa from 'koa';
import cors from '@koa/cors';
import { logger } from 'src/server/middleware/logger';
import { locale } from 'src/server/middleware/locale';
import { setCacheHeader } from 'src/server/middleware/cacheHeaders';
import { error } from 'src/server/middleware/error';
import { getLogger } from 'src/shared/logger';
import { killHandler } from 'src/server/utils/killHandler';
import { router } from 'src/server/router';
import { getServerConfig } from 'src/server/utils/config';
import { sentry } from 'src/server/middleware/sentry';
import { handleError } from 'src/server/utils/handleError';
import { beforeSend } from 'src/shared/sentry';
import LogRocket from 'logrocket';

let app: App.Server;
let LOGGER: App.Logger;

try {
    Sentry.init({
        beforeSend,
        autoSessionTracking: true,
        debug: process.env.DEBUG_BUILD === 'true',
        dsn: process.env.SENTRY_DSN,
        environment: process.env.DEPLOYMENT,
        integrations: [
            new Sentry.Integrations.Http({ breadcrumbs: true, tracing: true }),
            process.env.NODE_ENV === 'production' ? new CaptureConsole() : null,
            process.env.NODE_ENV === 'development' ? new Debug() : null,
        ].filter(Boolean) as Sentry.NodeOptions['integrations'],
        release: process.env.RELEASE,
        tracesSampleRate: 1.0,
    });

    LogRocket.getSessionURL((sessionURL) => {
        Sentry.configureScope((scope) => {
            scope.setExtra('sessionURL', sessionURL);
        });
    });

    // TODO identify user in request handler
    LogRocket.init(process.env.LOGROCKET_ACCOUNT_ID as string);
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(-1);
}

const stop = (): void => {
    LOGGER.flush();
    Sentry.close(2000).then(() => {
        if (app?.server) {
            app.server.close();
        }
    });
};

try {
    LOGGER = getLogger();
} catch (e) {
    Sentry.captureException(e);
    process.exit(-1);
}

try {
    app = new Koa<App.ServerState, App.ServerContext>();

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

    const { backlog, hostname, port, proxy } = app.context.config;

    app.proxy = !!proxy;

    app.use(error);
    app.use(sentry());
    app.use(locale);
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(logger(LOGGER));
    app.use(compress(app.context.config.compress));
    app.use(cors({ origin: '*' }));
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(setCacheHeader(app.context.config.caching?.maxAge));

    app.server = app.listen(port, hostname, backlog, () => {
        if (process.send) {
            process.send('ready');
        }
        LOGGER.info(`Server listening at ${hostname}:${port}...`);
    });
} catch (e) {
    LOGGER.error(e);
    Sentry.captureException(e);
    stop();
}

// import('src/server/main').then((m) => {
//     const server = new m.Server();

//     server.start();
// }).catch((e) => Sentry.captureException(e));
