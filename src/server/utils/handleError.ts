import * as Sentry from '@sentry/node';
import { ParameterizedContext } from 'koa';
import { HTTPError } from 'ky';
import { getLogger } from 'src/shared/logger';
import { runSentryErrorProcessing } from 'src/server/utils/sentry';
import { v4 as uuid } from 'uuid';

const DEFAULT_STATUS = 500;

export const handleError = (e: Error, ctx: ParameterizedContext | undefined): void => {
    const guid = uuid();

    if (ctx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctx.status = (e as HTTPError).response?.status || (e as any).status || DEFAULT_STATUS;
        const { status, request, log } = ctx;

        const logger = log || getLogger();

        Sentry.withScope((scope) => {
            runSentryErrorProcessing(ctx, scope);
            const ev = scope.addEventProcessor((event) => Sentry.addRequestDataToEvent(event, ctx.request));

            logger.error(
                {
                    guid,
                    request,
                    status,
                    locale: ctx.state.locale,
                    url: ctx.request.url,
                    ...(e as Error),
                    ...ev,
                },
                (e as Error).message,
            );
        });

        ctx.response.set('Cache-Control', 'public, max-age=0');
        ctx.response.set('Guid', guid);
        ctx.body = '';
    } else {
        getLogger().error(
            {
                guid,
                ...(e as Error),
            },
            (e as Error).message,
        );
    }
};
