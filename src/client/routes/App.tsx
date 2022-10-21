import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { RecoilRoot } from 'recoil';
import { Auth0ProviderWithRedirectCallback } from 'src/client/components/Auth0ProviderWithRedirectCallback ';
import { ErrorBoundary } from 'react-error-boundary';
import { getLogger } from 'src/shared/logger';

export const App = (): JSX.Element => (
    <main>
        <Auth0ProviderWithRedirectCallback
            useRefreshTokens
            clientId={process.env.AUTH0_CLIENT_ID as string}
            domain={process.env.AUTH0_DOMAIN as string}
            redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
        >
            <RecoilRoot>
                <ErrorBoundary
                    FallbackComponent={() => <p>Error!</p>}
                    onError={(e) => getLogger().error(e, e.message)}
                    onReset={() => {
                        // reset the state of your app so the error doesn't happen again
                    }}
                >
                    <Suspense fallback={<p>Loading...</p>}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </RecoilRoot>
        </Auth0ProviderWithRedirectCallback>
    </main>
);
