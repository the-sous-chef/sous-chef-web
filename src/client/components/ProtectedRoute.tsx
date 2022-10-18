import { withAuthenticationRequired, WithAuthenticationRequiredOptions } from '@auth0/auth0-react';
import { ComponentType } from 'react';

export type PropTypes = Partial<WithAuthenticationRequiredOptions> & {
    component: ComponentType;
};

export const ProtectedRoute = (props: PropTypes): JSX.Element => {
    const { component, ...args } = props;
    const Component = withAuthenticationRequired(component, args);

    return <Component />;
};
