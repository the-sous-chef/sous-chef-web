import compress from 'koa-compress';
import helmet from 'koa-helmet';
import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-pino-logger';
import { locale } from 'src/server/middleware/locale';
import { Server as NetServer } from 'net';
import { accessLogger } from 'src/server/middleware/accessLogger';
import { setCacheHeader } from 'src/server/middleware/cacheHeaders';
import { error } from 'src/server/middleware/error';
import { getLogger } from 'src/server/utils/logger';
import { killHandler } from 'src/server/utils/killHandler';
import { router } from 'src/server/router';
import { getServerConfig } from 'src/server/utils/config';

const LOGGER = getLogger();

export class Server {
    app: Koa<App.ServerState, App.ServerContext>;

    server: NetServer | null = null;

    constructor() {
        this.app = new Koa<App.ServerState, App.ServerContext>();
        this.app.silent = true;

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
        this.app.on('error', (e, ctx) => {
            LOGGER.error({
                url: ctx.request.url,
                ...e,
            }, `Request cancelled: A fatal error occured: ${e}`);
        });
    }

    async initializeMiddleware(): Promise<void> {
        this.app.use(error);
        this.app.use(locale);
        this.app.use(helmet({ contentSecurityPolicy: false }));
        this.app.use(logger());
        this.app.use(accessLogger(LOGGER));
        this.app.use(compress(this.app.context.config.compress));
        this.app.use(cors({ origin: '*' }));
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
        this.app.use(setCacheHeader(this.app.context.config.caching?.maxAge));
    }

    async start(): Promise<void> {
        this.app.context.config = await getServerConfig();

        const {
            backlog,
            hostname,
            port,
            proxy,
        } = this.app.context.config;

        this.app.proxy = !!proxy;

        try {
            await this.initializeMiddleware();

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
            LOGGER.fatal(e as Error, `There was an error starting the server: ${e}`);
        }
    }

    stop(): void {
        if (this && this.server) {
            this.server.close();
        }
    }
}
