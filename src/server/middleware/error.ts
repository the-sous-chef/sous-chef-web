import { Next, ParameterizedContext } from 'koa';
import { ServerError } from 'src/server/utils/errors';
import { handleError } from 'src/server/utils/handleError';

/**
 * Error handling middleware.
 * Catches any errors thrown from the subsequent middleware/handlers, sets the
 * appropriate error response, and triggers the `error` event on the Koa app
 * @param ctx
 * @param next
 */
export const error = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    try {
        await next();

        // Intercept any 404 responses to handle them properly
        if (ctx.status === 404) {
            throw new ServerError('Not Found', { url: ctx.req.url || '', status: 404 });
        }
    } catch (e) {
        // eslint-disable-next-line no-debugger
        debugger;
        handleError(e as Error, ctx);
    }
};
