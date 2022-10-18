import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';

export type PropTypes = {
    children: JSX.Element;
};

export const AuthBoundary = (props: PropTypes): JSX.Element => {
    const { children } = props;
    const { isAuthenticated, isLoading } = useAuth0();
    const location = useLocation();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate replace state={{ from: location }} to="/login" />;
    }

    return children;
};
