import { RecoilRoot } from 'recoil';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StaticRouter } from 'react-router-dom/server';
import { routes } from 'src/client/routes';
import { Routes } from 'react-router';

export type PropTypes = {
    dehydratedState: DehydratedState;
    location: string;
    queryClient: QueryClient;
};

export function SSR(props: PropTypes): JSX.Element {
    const { dehydratedState, location, queryClient } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <RecoilRoot>
                    <StaticRouter location={location}>
                        <Routes>{routes}</Routes>
                    </StaticRouter>
                </RecoilRoot>
            </Hydrate>
        </QueryClientProvider>
    );
}
