/**
 * @module utils/killHandler
 * @exports killHandler
 */

import { Logger } from 'pino';

/**
 * Handler for capturing a kill event and stopping the current process
 */
export function killHandler(logger: Logger, cb: (() => void)): () => void {
    return (): void => {
        logger.info('Captured shutdown request');

        cb();

        process.exit(0);
    };
}
