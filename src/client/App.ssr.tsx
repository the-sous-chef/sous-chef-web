import { StaticRouter, StaticRouterContext } from 'react-router';
import { CacheProvider, EmotionCache } from '@emotion/react';
import {
    ApolloClient,
    ApolloProvider,
    NormalizedCacheObject,
} from '@apollo/client';

import { App } from 'src/client/App';

export interface PropTypes {
    cache: EmotionCache;
    client: ApolloClient<NormalizedCacheObject>;
    location?: string;
    routerContext: StaticRouterContext;
}

export const SsrApp = (props: PropTypes): JSX.Element => {
    const {
        cache,
        client,
        location,
        routerContext,
    } = props;

    return (
        <CacheProvider value={cache}>
            <ApolloProvider client={client}>
                <StaticRouter location={location} context={routerContext}>
                    <App />
                </StaticRouter>
            </ApolloProvider>
        </CacheProvider>
    );
};
