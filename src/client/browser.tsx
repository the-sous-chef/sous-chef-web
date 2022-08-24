/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hydrateRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { App } from 'src/client/App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const queryClient = new QueryClient();
const dehydratedState = (window as unknown as Window & { __REACT_QUERY_STATE__: string }).__REACT_QUERY_STATE__;

// TODO https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEPLOYMENT,
    integrations: [new BrowserTracing()],
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
    tracesSampleRate: 1.0,
});

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
