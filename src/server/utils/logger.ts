import pino from 'pino';

const logger = pino();

export const getLogger = (): App.Logger => logger;
