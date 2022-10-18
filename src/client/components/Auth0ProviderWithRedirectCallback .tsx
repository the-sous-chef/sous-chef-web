import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { ComponentProps } from 'react';
import { useNavigate } from 'react-router';

export type PropTypes = ComponentProps<typeof Auth0Provider>;

export const Auth0ProviderWithRedirectCallback = (props: PropTypes): JSX.Element => {
    const { children, ...rest } = props;
    const navigate = useNavigate();
    const onRedirectCallback = (appState: AppState | undefined): void => {
        navigate((appState && appState.returnTo) || window.location.pathname);
    };

    return (
        <Auth0Provider onRedirectCallback={onRedirectCallback} {...rest}>
            {children}
        </Auth0Provider>
    );
};
