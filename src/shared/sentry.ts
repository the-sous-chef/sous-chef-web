import { normalizeSentryToConsoleMethod } from 'src/shared/logger';
import type { Event, EventHint } from '@sentry/types';

export const beforeSend = (event: Event, hint: EventHint) => {
    if (event.level === 'debug' || event.level === 'info' || event.level === 'log') {
        return null;
    }

    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_BUILD) {
        const log = normalizeSentryToConsoleMethod(event.level || 'debug');

        // eslint-disable-next-line no-console
        console[log](hint.originalException || hint.syntheticException || event);
        return null; // this drops the event and nothing will be sent to sentry
    }

    return event;
};
