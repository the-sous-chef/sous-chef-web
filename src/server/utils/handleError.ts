import * as Sentry from '@sentry/node';
import { ParameterizedContext } from 'koa';
import { HTTPError } from 'ky';
import { getLogger } from 'src/shared/logger';
import { runSentryErrorProcessing } from 'src/server/utils/sentry';
import { v4 as uuid } from 'uuid';

const DEFAULT_STATUS = 500;

const generateMetaData = (ctx: ParameterizedContext | undefined, guid: string): Record<string, unknown> => {
    const meta = { guid };

    if (ctx) {
        return {
            ...meta,
            request: JSON.stringify(ctx.request),
            status: ctx.status,
            locale: ctx.state.locale,
            url: ctx.request.url,
        };
    }

    return meta;
};

export const handleError = (e: Error, ctx: ParameterizedContext | undefined): Promise<void> => {
    const guid = uuid();
    const logger = ctx?.log || getLogger();

    return new Promise((resolve, reject) => {
        Sentry.withScope((scope) => {
            if (ctx) {
                // @ts-expect-error using custom event
                logger.once('before:log', () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ctx.status = (e as HTTPError).response?.status || (e as any).status || DEFAULT_STATUS;
                    scope.addEventProcessor((event) => Sentry.addRequestDataToEvent(event, ctx.request));
                });

                // @ts-expect-error using custom event
                logger.once('after:log', () => {
                    ctx.response.set('Cache-Control', 'public, max-age=0');
                    ctx.response.set('Guid', guid);
                    ctx.body = '';
                });
            }

            try {
                runSentryErrorProcessing(ctx, scope);
                logger.emit('before:log');

                const meta = generateMetaData(ctx, guid);

                logger.error({ err: e, meta }, e.message);
                logger.emit('after:log');

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });
};
