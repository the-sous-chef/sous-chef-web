import * as Sentry from '@sentry/node';
import { ParameterizedContext } from 'koa';
import { getLogger } from 'src/shared/logger';

export const handleError = (e: Error, ctx: ParameterizedContext): void => {
    Sentry.withScope((scope) => {
        scope.addEventProcessor((event) => Sentry.addRequestDataToEvent(event, ctx.request));
        getLogger().error({
            url: ctx.request.url,
            ...e,
        }, `Request cancelled: A fatal error occured: ${e}`);
    });
};
