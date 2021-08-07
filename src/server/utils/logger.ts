import logger, { LoggerOptions } from 'pino';

export const getLogger = (options: LoggerOptions = {}): logger.Logger => logger(options);
