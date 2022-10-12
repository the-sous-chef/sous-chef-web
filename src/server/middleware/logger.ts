import pinoHttp, { Options } from 'pino-http';
import type { DestinationStream } from 'pino';
import { Next, ParameterizedContext } from 'koa';

export const logger = (opts?: Options | undefined, stream?: DestinationStream | undefined) => {
    const wrap = pinoHttp(opts, stream);

    function pino(ctx: ParameterizedContext, next: Next): Promise<ReturnType<Next>> {
        wrap(ctx.req, ctx.res);
        // @ts-expect-error log is being added
        // eslint-disable-next-line no-multi-assign
        ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;

        return next();
    }

    pino.logger = wrap.logger;

    return pino;
};
