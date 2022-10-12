/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hydrateRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'src/client/App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { beforeSend } from 'src/shared/sentry';
import LogRocket from 'logrocket';

const queryClient = new QueryClient();
const dehydratedState = (window as unknown as Window & { __REACT_QUERY_STATE__: string }).__REACT_QUERY_STATE__;

// TODO https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
Sentry.init({
    beforeSend,
    debug: process.env.DEBUG_BUILD === 'true',
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEPLOYMENT,
    integrations: [new BrowserTracing()],
    release: process.env.RELEASE,
    tracesSampleRate: 1.0,
});

// TODO identify users
LogRocket.init(process.env.LOGROCKET_ACCOUNT_ID as string);

hydrateRoot(
    document.getElementById('root') as Element,
    <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
            <RecoilRoot>
                <App />
            </RecoilRoot>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
);
