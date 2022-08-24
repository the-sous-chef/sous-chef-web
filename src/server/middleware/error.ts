import { v4 as uuid } from 'uuid';
import { Next, ParameterizedContext } from 'koa';
import { HTTPError } from 'ky';
import { ServerError } from 'src/server/utils/errors';
import * as Sentry from '@sentry/node';
import { runSentryErrorProcessing } from 'src/server/utils/sentry';

const DEFAULT_STATUS = 500;

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
        const guid = uuid();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctx.status = (e as HTTPError).response?.status || (e as any).status || DEFAULT_STATUS;
        const { status, request } = ctx;

        Sentry.withScope((scope) => {
            runSentryErrorProcessing(ctx, scope);
            scope.addEventProcessor((event) => Sentry.addRequestDataToEvent(event, ctx.request));
            ctx.log.error({
                locale: ctx.state.locale,
                guid,
                request,
                status,
                ...(e as Error),
            }, (e as Error).message);
        });

        ctx.response.set('Cache-Control', 'public, max-age=0');
        ctx.response.set('Guid', guid);
        ctx.body = '';
    }
};
