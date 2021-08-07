import { captureException as sentryCaptureException } from '@sentry/react';
import { captureException as logrocketCaptureException } from 'logrocket';

const logger = {
    error: (e: Error): void => {
        console.error(e);

        logrocketCaptureException(e);
        sentryCaptureException(e);
    },
};

export const getLogger = (): typeof logger => logger;
