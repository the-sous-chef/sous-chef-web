/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import * as Sentry from '@sentry/node';
import { extractTraceparentData, stripUrlQueryAndFragment } from '@sentry/tracing';
import { Next, ParameterizedContext } from 'koa';
// @ts-expect-error not sure why this isn't expose
import { addRequestDataToEvent, isAutoSessionTrackingEnabled, flush } from '@sentry/node/esm/sdk';
import { logger } from '@sentry/utils';

export type RequestHandlerOptions = Sentry.AddRequestDataToEventOptions & {
    flushTimeout?: number;
};

export const sentry = (
    options?: RequestHandlerOptions,
) => {
    const currentHub = Sentry.getCurrentHub();
    const client = currentHub.getClient<Sentry.NodeClient>();

    // Initialise an instance of SessionFlusher on the client when `autoSessionTracking` is enabled and the
    // `requestHandler` middleware is used indicating that we are running in SessionAggregates mode
    if (client && isAutoSessionTrackingEnabled(client)) {
        client.initSessionFlusher();

        // If Scope contains a Single mode Session, it is removed in favor of using Session Aggregates mode
        const scope = currentHub.getScope();

        if (scope && scope.getSession()) {
            scope.setSession();
        }
    }

    return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
        const reqMethod = (ctx.method || '').toUpperCase();
        const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);
        const traceparentData = (ctx.request.get('sentry-trace'))
            ? extractTraceparentData(ctx.request.get('sentry-trace'))
            : null;
        const eventProcessor = (event: Sentry.Event) => addRequestDataToEvent(event, ctx.req, options);

        if (options?.flushTimeout) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const _end = ctx.res.end;
            const flushAtEnd = (
                chunk: any,
                encoding: BufferEncoding,
                cb?: (() => void) | undefined,
            ) => {
                flush(options.flushTimeout)
                    .then(() => {
                        _end.call(this, chunk, encoding, cb);
                    })
                    .catch((e: Error) => {
                        if (process.env.NODE_ENV === 'development') {
                            logger.error(e);
                        }

                        _end.call(this, chunk, encoding, cb);
                    });
            };

            // @ts-expect-error don't event try to type this
            ctx.res.end = flushAtEnd;
        }

        ctx.state.transaction = Sentry.startTransaction({
            name: `${reqMethod} ${reqUrl}`,
            op: 'http.server',
            ...traceparentData,
        });

        currentHub.configureScope((scope) => {
            scope.setSpan(ctx.state.transaction);
            scope.addEventProcessor(eventProcessor);

            const scopedClient = currentHub.getClient<Sentry.NodeClient>();

            if (isAutoSessionTrackingEnabled(scopedClient)) {
                // Set `status` of `RequestSession` to Ok, at the beginning of the request
                scope.setRequestSession({ status: 'ok' });
            }
        });

        ctx.res.on('finish', () => {
            const scopedClient = currentHub.getClient<Sentry.NodeClient>();

            if (isAutoSessionTrackingEnabled(scopedClient)) {
                setImmediate(() => {
                    // @ts-expect-error access protected method
                    if (scopedClient && scopedClient._captureRequestSession) {
                        // Calling _captureRequestSession to capture request session at the end
                        // of the request by incrementing the correct SessionAggregates bucket
                        // i.e. crashed, errored or exited
                        // @ts-expect-error access protected method
                        scopedClient._captureRequestSession();
                    }
                });
            }

            // Push `transaction.finish` to the next event loop so open spans have a chance to
            // finish before the transaction closes
            setImmediate(() => {
                // if using koa router, a nicer way to capture transaction using the matched route
                if (ctx._matchedRoute) {
                    const mountPath = ctx.mountPath || '';

                    ctx.state.transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
                }
                ctx.state.transaction.setHttpStatus(ctx.status);
                ctx.state.transaction.finish();
                ctx.state.transaction = null;
            });
        });

        await next();
    };
};
