// eslint-disable-next-line import/no-named-as-default
import pinoHttp from 'pino-http';
import { Next, ParameterizedContext } from 'koa';

export const logger = (logger: App.Logger) => {
    const wrap = pinoHttp({
        logger,
    });

    return function loggerMiddleware(ctx: ParameterizedContext, next: Next): Promise<ReturnType<Next>> {
        wrap(ctx.req, ctx.res);
        // @ts-expect-error log is being added
        // eslint-disable-next-line no-multi-assign
        ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;

        return next();
    };
};
