import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router';

export const LoginButton = (): JSX.Element => {
    const location = useLocation();
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            onClick={() =>
                loginWithRedirect({
                    redirectUri: location.state?.from?.pathname || '/home',
                })
            }
        >
            Log In
        </button>
    );
};
