import { Next, ParameterizedContext } from 'koa';

export const livecheck = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    ctx.status = 200;
    ctx.body = 'OK';

    await next();
};
