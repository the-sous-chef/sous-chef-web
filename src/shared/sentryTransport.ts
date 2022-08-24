import { captureException, captureMessage, SeverityLevel } from '@sentry/react';
import { Scope } from '@sentry/types';
import * as Sentry from '@sentry/node';
import build from 'pino-abstract-transport';
// @ts-expect-error not sure why this isn't expose
import { isAutoSessionTrackingEnabled } from '@sentry/node/esm/sdk';
import { ParameterizedContext } from 'koa';

export type PinoSentryOptions = {
    minLevel?: number;
    withLogRecord?: boolean;
    tags?: (string | Record<string, unknown>)[];
    context?: (string | Record<string, unknown>)[];
}

const defaultOptions = {
    minLevel: 10,
    withLogRecord: false,
};

const shouldLog = (level: number, minLevel: number): boolean => level >= minLevel;

const pinoLevelToSentryLevel = (level: number): SeverityLevel => {
    if (level === 60) {
        return 'fatal';
    }
    if (level >= 50) {
        return 'error';
    }
    if (level >= 40) {
        return 'warning';
    }
    if (level >= 30) {
        return 'log';
    }
    if (level >= 20) {
        return 'info';
    }
    return 'debug';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enrichScope = (scope: Scope, event: any, options: PinoSentryOptions): Scope => {
    scope.setLevel(pinoLevelToSentryLevel(event.level));

    if (options.withLogRecord) {
        scope.setContext('pino-log-record', event);
    }

    if (options.tags?.length) {
        options.tags.forEach((tag) => {
            const key = typeof tag === 'string' ? tag : Object.keys(tag)[0];
            const value = typeof tag === 'string' ? event[tag] : tag[key];

            scope.setTag(key, value);
        });
    }

    if (options.context?.length) {
        const context = options.context.reduce((accum: Record<string, unknown>, c) => (
            (typeof c === 'string')
                ? { ...accum, [c]: event[c] }
                : { ...accum, ...c }
        ), {} as Record<string, unknown>);

        scope.setContext('pino-context', context);
    }

    return scope;
};

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

    if (client && isAutoSessionTrackingEnabled(client)) {
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

/**
 *
 * @param options
 * @returns
 */
export default async function transport(
    options: Partial<PinoSentryOptions> = defaultOptions,
) {
    const { minLevel = defaultOptions.minLevel } = options;

    return build(async (source): Promise<void> => {
        // eslint-disable-next-line no-restricted-syntax
        for await (const obj of source) {
            if (obj && shouldLog(obj.level, minLevel)) {
                if (obj?.err) {
                    captureException(obj.err, (scope) => enrichScope(scope, obj, options));
                } else {
                    captureMessage(obj?.msg, (scope) => enrichScope(scope, obj, options));
                }
            }
        }
    });
}
