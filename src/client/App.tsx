import { Suspense } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import {
    CssBaseline,
    ThemeProvider,
    StyledEngineProvider,
    styled,
} from '@material-ui/core';

import { ErrorBoundary } from 'src/client/components/common/ErrorBoundary';
import { FirebaseProvider } from 'src/client/components/Providers/FirebaseProvider';
import { Head } from 'src/client/components/common/Head';
import { theme } from 'src/client/lib/theme';
import { Router } from 'src/client/components/common/Router';
import { Main } from 'src/client/components/common/Main';
import { Splash } from 'src/client/components/common/Splash';
import { config } from 'src/client/config';

const StyledRoot = styled('div')`
    display: flex;
    width: 100%;
`;

export const App = (): JSX.Element => (
    <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
            <Head />
            <CssBaseline />
            <ErrorBoundary>
                <Auth0Provider
                    clientId={config.auth0.clientId}
                    domain={config.auth0.domain}
                    redirectUri={window.location.origin}
                >
                    <FirebaseProvider>
                        <Suspense fallback={<Splash />}>
                            <StyledRoot>
                                <Main>
                                    <Router />
                                </Main>
                            </StyledRoot>
                        </Suspense>
                    </FirebaseProvider>
                </Auth0Provider>
            </ErrorBoundary>
        </StyledEngineProvider>
    </ThemeProvider>
);
