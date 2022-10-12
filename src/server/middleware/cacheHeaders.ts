import { Next, ParameterizedContext } from 'koa';

export const setCacheHeader = (maxAge?: number) => async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    if (!ctx.response.headers.Expires) {
        const expires = new Date();

        expires.setSeconds(expires.getSeconds() + (maxAge !== undefined ? maxAge : 0));

        ctx.response.set('Expires', expires.toUTCString());
    }

    if (!ctx.response.headers['Cache-Control']) {
        const { cache } = ctx.query;

        ctx.response.set('Cache-Control', (cache === 'false') ? 'no-store' : `public, max-age=${maxAge}`);
    }

    return next();
};
