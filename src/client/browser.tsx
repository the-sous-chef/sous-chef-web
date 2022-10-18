/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hydrateRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { beforeSend } from 'src/shared/sentry';
import LogRocket from 'logrocket';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { routes } from 'src/client/routes';

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

const router = createBrowserRouter(createRoutesFromElements(routes));

hydrateRoot(
    document.getElementById('root') as Element,
    <Auth0Provider
        clientId={process.env.AUTH0_CLIENT_ID as string}
        domain={process.env.AUTH0_DOMAIN as string}
        redirectUri={window.location.origin}
        useRefreshTokens={true}
    >
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <RecoilRoot>
                    <RouterProvider router={router} />
                </RecoilRoot>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </Auth0Provider>,
);
