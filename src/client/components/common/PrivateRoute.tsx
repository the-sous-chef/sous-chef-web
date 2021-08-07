import { ComponentProps } from 'react';
import {
    Redirect, Route, RouteComponentProps, RouteProps,
} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import { LOGIN } from 'src/client/utils/routes';

export type PropTypes = ComponentProps<typeof Route>;

export const PrivateRoute = (props: RouteProps): JSX.Element => {
    const { component: Component, ...rest } = props;
    const { isAuthenticated } = useAuth0();

    const render = (renderProps: RouteComponentProps<any>): JSX.Element => (
        <>
            {/* @ts-expect-error */}
            {isAuthenticated && (<Component {...renderProps} />)}
            {!isAuthenticated && (
                <Redirect
                    to={{
                        pathname: LOGIN,
                        state: { from: renderProps.location },
                    }}
                />
            )}
        </>
    );

    return (<Route {...rest} render={render} />);
};
