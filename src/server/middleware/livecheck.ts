// import newrelic from 'newrelic';
import { Next, ParameterizedContext } from 'koa';

export const livecheck = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    ctx.status = 200;
    ctx.body = 'OK';

    // newrelic.getTransaction().ignore();

    return next();
};
