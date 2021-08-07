import { HTMLProps } from 'react';
import { useRecoilValue } from 'recoil';
import { useAuth0 } from '@auth0/auth0-react';

import 'src/client/lib/firebase';
import { firebaseAuthQuery } from 'src/client/selectors/firebaseAuthQuery';
import { Splash } from 'src/client/components/common/Splash';

export const FirebaseProvider = (props: HTMLProps<HTMLElement>): JSX.Element => {
    const { children } = props;
    const { user } = useAuth0();
    const firebaseToken = useRecoilValue(firebaseAuthQuery(user?.accessToken));

    return (
        <>
            {!user || !firebaseToken && (<Splash />)}
            {user !== null && firebaseToken !== null && children}
        </>
    );
};
