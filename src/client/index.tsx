import createCache from '@emotion/cache';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { CacheProvider } from '@emotion/react';
import { createBrowserHistory } from 'history';
import { createRoot } from 'react-dom';
import { configureScope, init as sentryInit, reactRouterV5Instrumentation } from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { BrowserRouter } from 'react-router-dom';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
} from '@apollo/client';

import { App } from 'src/client/App';
import { EMOTION_CACHE_KEY } from 'src/client/constants';

const client = new ApolloClient({
    // @ts-expect-error
    // eslint-disable-next-line no-underscore-dangle
    cache: new InMemoryCache().restore(JSON.parse(window.__APOLLO_STATE__)),
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

const cache = createCache({ key: EMOTION_CACHE_KEY });

const container = document.getElementById('app');
const history = createBrowserHistory();

// TODO make secret?
LogRocket.init('6siy7k/sous-chef');
// plugins should also only be initialized when in the browser
setupLogRocketReact(LogRocket);

sentryInit({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [new Integrations.BrowserTracing({
        routingInstrumentation: reactRouterV5Instrumentation(history),
    })],
    release: `${process.env.APP_NAME}@${process.env.VERSION}`,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    beforeSend(event) {
        const logRocketSession = LogRocket.sessionURL;

        if (logRocketSession !== null) {
            if (!event.extra) {
                // eslint-disable-next-line no-param-reassign
                event.extra = {};
            }

            // eslint-disable-next-line no-param-reassign
            event.extra.LogRocket = logRocketSession;
            return event;
        }
        return event;
    },
});

LogRocket.getSessionURL((sessionURL) => {
    configureScope((scope) => {
        scope.setExtra('sessionURL', sessionURL);
    });
});

if (container) {
    const root = createRoot(container, { hydrate: true });

    root.render(
        <CacheProvider value={cache}>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloProvider>
        </CacheProvider>,
    );
} else {
    console.error('No element found to mount on');
}
