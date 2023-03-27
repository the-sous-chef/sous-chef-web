import type { LoaderArgs } from '@remix-run/cloudflare';

export const loader = async ({ request, context }: LoaderArgs) => {
    return (context as App.AppLoadContext).auth.authenticate('auth0', request, {
        successRedirect: '/home',
        failureRedirect: '/',
    });
};
