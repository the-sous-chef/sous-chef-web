import pino from 'pino';

const pipeline: pino.TransportSingleOptions<Record<string, unknown>>[] = [{ target: '../..shared/sentryTransport.ts' }];

if (process.env.NODE_ENV === 'development') {
    pipeline.push({ target: 'pino-pretty', options: { colorize: true } });
}

const transport = pino.transport({ pipeline });
const logger = pino(transport);

export const getLogger = (): App.Logger => logger;
