import { captureException, configureScope, startTransaction } from '@sentry/node';
import { Next, ParameterizedContext } from 'koa';

export const sentry = (name: string) => async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    const transaction = startTransaction({
        name,
    }, {
        url: ctx.req.url,
        method: ctx.req.method,
        headers: ctx.req.headers,
    });

    configureScope((scope) => {
        scope.setSpan(transaction);
    });

    ctx.transaction = transaction;

    try {
        await next();
    } catch (e) {
        captureException(e);
    } finally {
        transaction.finish();
    }
};
