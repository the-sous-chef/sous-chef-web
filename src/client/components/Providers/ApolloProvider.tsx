import {
    ApolloClient,
    ApolloProvider as ApolloClientProvider,
    InMemoryCache,
} from '@apollo/client';
import { HTMLProps } from 'react';
import { useRecoilValue } from 'recoil';
import { useAuth0 } from '@auth0/auth0-react';

import { currentConfigQuery } from 'src/client/selectors/currentConfigQuery';
import { Splash } from 'src/client/components/common/Splash';

export const ApolloProvider = (props: HTMLProps<HTMLElement>): JSX.Element => {
    const { children } = props;
    const { user } = useAuth0();
    const config = useRecoilValue(currentConfigQuery(user?.accessToken));

    return (
        <>
            {!user || !config && (<Splash />)}
            {user !== null && config !== null && (
                <ApolloClientProvider
                    client={new ApolloClient({
                        uri: config.services.gateway.prefixUrl,
                        cache: new InMemoryCache(),
                    })}
                >
                    {children}
                </ApolloClientProvider>
            )}
        </>
    );
};
