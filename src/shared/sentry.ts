import type { Event, EventHint, SeverityLevel } from '@sentry/types';
import LogRocket from 'logrocket';

type ConsoleMethods = 'debug' | 'info' | 'warn' | 'error' | 'trace' | 'log';

export const normalizeSentryToConsoleMethod = (level: SeverityLevel): ConsoleMethods => {
    switch (level) {
        case 'fatal':
            return 'error';
        case 'warning':
            return 'warn';
        default:
            return level;
    }
};

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

    const logRocketSession = LogRocket.sessionURL;

    if (logRocketSession !== null) {
        if (!event.extra) {
            event.extra = {};
        }

        event.extra['LogRocket'] = logRocketSession;
    }

    return event;
};
