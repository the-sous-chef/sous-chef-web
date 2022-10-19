// eslint-disable-next-line import/no-named-as-default
import pino from 'pino';
import { browser } from '@blacklab/pino-sentry-transport';

function serverLogger() {
    const pipeline: pino.TransportSingleOptions<Record<string, unknown>>[] = [
        {
            target: '@blacklab/pino-sentry-transport',
            options: {
                context: ['meta'],
                enablePipelining: true,
                minLevel: 40,
            },
        },
    ];

    if (process.env.NODE_ENV === 'development') {
        pipeline.push({ target: 'pino-pretty', options: { colorize: true } });
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return pino(pino.transport({ pipeline }));
}

function browserLogger() {
    return pino({
        browser: browser(),
    });
}

// @ts-expect-error this can be undefined in the browser
// eslint-disable-next-line import/no-named-as-default-member
const logger = pino.transport ? serverLogger() : browserLogger();

export const getLogger = (): App.Logger => logger;
