import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
// @ts-expect-error
import * as build from '@remix-run/dev/server-build';
import { init } from '~/lib/auth.server.ts';

const handleRequest = createPagesFunctionHandler<App.Env>({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext: (context) => {
        const { auth, sessionStorage } = init(context);

        return {
            ...context,
            auth,
            sessionStorage,
        };
    },
});

export function onRequest(context: EventContext<App.Env, any, any>) {
    return handleRequest(context);
}
