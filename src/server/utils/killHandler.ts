/**
 * @module utils/killHandler
 * @exports killHandler
 */

/**
 * Handler for capturing a kill event and stopping the current process
 */
export function killHandler(logger: App.Logger, cb: () => void) {
    return (): void => {
        logger.info('Captured shutdown request');

        cb();

        process.exit(0);
    };
}
