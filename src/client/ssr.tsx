import { RecoilRoot } from 'recoil';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'src/client/App';

export type PropTypes = {
    dehydratedState: DehydratedState;
    queryClient: QueryClient;
};

export function SSR(props: PropTypes): JSX.Element {
    const { dehydratedState, queryClient } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <RecoilRoot>
                    <App />
                </RecoilRoot>
            </Hydrate>
        </QueryClientProvider>
    );
}
