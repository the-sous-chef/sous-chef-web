import '@sentry/tracing';
import body from 'koa-body';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import Koa from 'koa';
import koaLogger from 'koa-pino-logger';
import { Server as NetServer } from 'net';
import { init, Integrations } from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

import { getConfig } from 'src/server/utils/config';
import { getLogger } from 'src/server/utils/logger';
import { killHandler } from 'src/server/utils/killHandler';
import { router } from 'src/server/router';

const LOGGER = getLogger();

init({
    dsn: process.env.SENTRY_DSN,
    release: `${process.env.APP_NAME}@${process.env.VERSION}`,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    integrations: [
        // enable HTTP calls tracing
        new Integrations.Http({ tracing: true }),
        new Integrations.OnUncaughtException(),
        new Integrations.OnUnhandledRejection(),
        new RewriteFrames(),
    ],
});

export class Server {
    app: Koa;

    server: NetServer | null = null;

    constructor() {
        this.app = new Koa();

        this.initializeHooks();
    }

    initializeHooks(): void {
        // pm2 graceful shutdown compatibility
        // Catches ctrl+c event
        process.on('SIGINT', killHandler(LOGGER, this.stop));

        // atexit handler
        process.on('exit', this.stop);

        // Centralized logging. Anytime the `error` event is called on the app
        // (i.e. when app.error is called), make sure that the
        // error is logged
        this.app.on('error', (err, ctx) => {
            LOGGER.error({
                url: ctx.request.url,
                message: 'Request cancelled: A fatal error occured',
            }, err);
        });
    }

    async initializeMiddleware(config: App.Config): Promise<void> {
        // Add common request security measures
        this.app.use(helmet());
        this.app.use(compress(config.compress));
        this.app.use(body());
        this.app.use(koaLogger());

        // Set server router
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
    }

    async start(): Promise<void> {
        const config = await getConfig();
        const {
            backlog, hostname, port, proxy,
        } = config;

        try {
            await this.initializeMiddleware(config);

            this.app.proxy = !!proxy;
            this.server = this.app.listen(
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
            LOGGER.critical('There was an error starting the server', e);
        }
    }

    stop(): void {
        LOGGER.flush();

        if (this && this.server) {
            this.server.close();
        }
    }
}
