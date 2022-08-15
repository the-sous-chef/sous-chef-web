import { Next, ParameterizedContext } from 'koa';

export const robots = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    ctx.response.body = 'User-agent: *\nDisallow: /';
    ctx.response.type = 'text/plain';
    ctx.response.set('Cache-Control', 'public, max-age=3600');

    await next();
};
