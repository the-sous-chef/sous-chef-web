import compress from 'koa-compress';
import helmet from 'koa-helmet';
import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-pino-logger';
import { locale } from 'src/server/middleware/locale';
import { Server as NetServer } from 'net';
import { setCacheHeader } from 'src/server/middleware/cacheHeaders';
import { error } from 'src/server/middleware/error';
import { getLogger } from 'src/shared/logger';
import { killHandler } from 'src/server/utils/killHandler';
import { router } from 'src/server/router';
import { getServerConfig } from 'src/server/utils/config';
import { sentry } from 'src/server/middleware/sentry';
import * as Sentry from '@sentry/node';
import { handleError } from 'src/server/utils/handleError';

const LOGGER = getLogger();

export class Server {
    app: Koa<App.ServerState, App.ServerContext>;

    server: NetServer | null = null;

    constructor() {
        this.app = new Koa<App.ServerState, App.ServerContext>();
        this.app.silent = true;

        // pm2 graceful shutdown compatibility
        // Catches ctrl+c event
        process.on('SIGINT', killHandler(LOGGER, this.stop));

        // atexit handler
        process.on('exit', this.stop);

        // Centralized logging. Anytime the `error` event is called on the app
        // (i.e. when app.error is called), make sure that the
        // error is logged
        this.app.on('error', handleError);
    }

    async start(): Promise<void> {
        try {
            this.app.context.config = await getServerConfig();

            const {
                backlog,
                hostname,
                port,
                proxy,
            } = this.app.context.config;

            this.app.proxy = !!proxy;

            this.app.use(error);
            this.app.use(sentry());
            this.app.use(locale);
            this.app.use(helmet({ contentSecurityPolicy: false }));
            this.app.use(logger());
            this.app.use(compress(this.app.context.config.compress));
            this.app.use(cors({ origin: '*' }));
            this.app.use(router.routes());
            this.app.use(router.allowedMethods());
            this.app.use(setCacheHeader(this.app.context.config.caching?.maxAge));

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
            this.stop();
        }
    }

    stop(): void {
        Sentry.close(2000).then(() => {
            if (this && this.server) {
                this.server.close();
            }
        });
    }
}
