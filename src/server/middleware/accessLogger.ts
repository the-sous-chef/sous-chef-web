import morgan from 'morgan';
import { Middleware, Next, ParameterizedContext } from 'koa';

/**
 * Middleware that uses `moargan` to log all requests (access logging) using
 * the provided Logger instance. Our usage of `morgan` has been adapted for
 * our Koa middleware style.
 *
 * {@see Logger}
 * {@see https://github.com/expressjs/morgan}
 */
export const accessLogger = (logger: App.Logger, format = 'combined', opts: Record<string, unknown> = {}): Middleware => {
    const morganLogger = morgan(format, {
        // Don't log access logs is response is OK or redirect
        skip: (_req, res) => res.statusCode < 400,
        stream: {
            write: logger.info.bind(logger),
        },
        ...opts,
    });

    return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
        await new Promise((resolve, reject) => {
            // @ts-ignore
            morganLogger(ctx.req, ctx.res, (err: Error) => (err ? reject(err) : resolve(ctx)));
        });

        await next();
    };
};
