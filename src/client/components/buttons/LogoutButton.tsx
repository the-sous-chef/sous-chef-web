import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = (): JSX.Element => {
    const { logout } = useAuth0();

    return <button onClick={() => logout({ returnTo: '/' })}>Log Out</button>;
};
