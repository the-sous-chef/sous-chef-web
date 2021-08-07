import { HTMLProps } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Splash } from 'src/client/components/common/Splash';

export const AuthBoundary = (props: HTMLProps<HTMLElement>): JSX.Element => {
    const { children } = props;
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    if (!isAuthenticated) {
        loginWithRedirect();
    }

    return (
        <>
            {!isAuthenticated || !user && (<Splash />)}
            {isAuthenticated !== null && user !== null && children}
        </>
    );
};
