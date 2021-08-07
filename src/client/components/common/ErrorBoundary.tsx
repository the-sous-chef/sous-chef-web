import {
    ErrorBoundary as ReactErrorBoundary,
    ErrorBoundaryPropsWithRender,
    FallbackProps,
} from 'react-error-boundary';
import { ReactNode } from 'react';

import { ErrorPage } from 'src/client/pages/ErrorPage';
import { getLogger } from 'src/client/utils/logger';

export type PropTypes = Omit<ErrorBoundaryPropsWithRender, 'fallbackRender'> & {
    children?: ReactNode;
    fallbackRender?: ErrorBoundaryPropsWithRender['fallbackRender'];
}

const LOGGER = getLogger();

const defaultFallbackRender = ({ error: e, resetErrorBoundary }: FallbackProps): JSX.Element => (
    <ErrorPage error={e} onReset={resetErrorBoundary} />
);

export const ErrorBoundary = (props: PropTypes): JSX.Element => {
    const {
        children,
        fallbackRender = defaultFallbackRender,
        fallback,
        ...rest
    } = props;

    return (
        <ReactErrorBoundary
            onError={(e): void => LOGGER.error(e)}
            {...rest}
            fallbackRender={fallbackRender}
        >
            {children}
        </ReactErrorBoundary>
    );
};
