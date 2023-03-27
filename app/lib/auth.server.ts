import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import type { Auth0Profile } from 'remix-auth-auth0';
import { Auth0Strategy } from 'remix-auth-auth0';

export const init = (context: EventContext<App.Env, any, any>) => {
    const sessionStorage = createCookieSessionStorage({
        cookie: {
            name: '_remix_session',
            sameSite: 'lax',
            path: '/',
            httpOnly: true,
            secrets: [context.env.SECRETS as string],
            secure: context.env.ENVIRONMENT === 'production',
        },
    });
    const auth = new Authenticator<Auth0Profile>(sessionStorage);
    const auth0Strategy = new Auth0Strategy(
        {
            callbackURL: context.env.AUTH0_CALLBACK_URL as string,
            clientID: context.env.AUTH0_CLIENT_ID as string,
            clientSecret: context.env.AUTH0_CLIENT_SECRET as string,
            domain: context.env.AUTH0_DOMAIN as string,
        },
        async ({ profile }) => {
            //
            // Use the returned information to process or write to the DB.
            //
            return profile;
        },
    );

    auth.use(auth0Strategy);

    return { auth, sessionStorage };
};
