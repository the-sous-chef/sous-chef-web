import * as Sentry from '@sentry/node';
import { ParameterizedContext } from 'koa';

/**
 *
 */
export const runSentryErrorProcessing = (
    ctx: ParameterizedContext,
    scope: Sentry.Scope,
) => {
    // For some reason we need to set the transaction on the scope again
    const { transaction } = ctx.context;

    if (transaction && scope.getSpan() === undefined) {
        scope.setSpan(transaction);
    }

    const client = Sentry.getCurrentHub().getClient<Sentry.NodeClient>();

    if (client) {
        // Check if the `SessionFlusher` is instantiated on the client to go into this branch that marks the
        // `requestSession.status` as `Crashed`, and this check is necessary because the `SessionFlusher` is only
        // instantiated when the the`requestHandler` middleware is initialised, which indicates that we should be
        // running in SessionAggregates mode
        // @ts-expect-error access protected method
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-underscore-dangle
        const isSessionAggregatesMode = client._sessionFlusher !== undefined;

        if (isSessionAggregatesMode) {
            const requestSession = scope.getRequestSession();
            // If an error bubbles to the `errorHandler`, then this is an unhandled error, and should be reported
            // as a crashed session. The `_requestSession.status` is checked to ensure that this error is happening
            // within the bounds of a request, and if so the status is updated

            if (requestSession && requestSession.status !== undefined) {
                requestSession.status = 'crashed';
            }
        }
    }
};
