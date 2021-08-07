import { atomFamily, selectorFamily } from 'recoil';
import {
    getAuth,
    signInWithCustomToken,
    UserCredential,
    signInAnonymously,
} from 'firebase/auth';

export const firebaseAuthRequestIDState = atomFamily({
    key: 'FirebaseAuthRequestIDState',
    default: '',
});

export const firebaseAuthQuery = selectorFamily({
    key: 'FirebaseAuth',
    get: (accessToken: string | undefined) => async ({ get }): Promise<UserCredential | null> => {
        get(firebaseAuthRequestIDState(accessToken || 'anonymous'));

        const auth = getAuth();
        const credentials = accessToken
            ? await signInWithCustomToken(auth, accessToken)
            : await signInAnonymously(auth);

        // TODO handle case to link anonymous user with newly signed in user?

        return credentials;
    },
});
