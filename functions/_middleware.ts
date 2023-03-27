import sentryPlugin from '@cloudflare/pages-plugin-sentry';
import { SessionTiming, Transaction } from '@sentry/integrations';

export const onRequest = (context: EventContext<App.Env, any, any>) => {
    debugger;
    // @ts-expect-error
    return sentryPlugin({
        dsn: context.env.SENTRY_DSN,
        integrations: [new SessionTiming(), new Transaction()],
    })(context);
};
