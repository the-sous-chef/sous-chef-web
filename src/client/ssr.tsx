import { RecoilRoot } from 'recoil';
import {
    dehydrate,
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { App } from 'src/client/App';

export type PropTypes = {
    queryClient: QueryClient;
};

export function SSR(props: PropTypes): JSX.Element {
    const { queryClient } = props;
    const dehydratedState = dehydrate(queryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <RecoilRoot>
                    <App />
                </RecoilRoot>
            </Hydrate>
            <script>
                {`window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};`}
            </script>
        </QueryClientProvider>
    );
}
