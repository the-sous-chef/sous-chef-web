import { ActionArgs, redirect } from '@remix-run/cloudflare';

export const action = async ({ request, context }: ActionArgs) => {
    const { sessionStorage } = (context as App.AppLoadContext);
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const logoutURL = new URL(process.env.AUTH0_LOGOUT_URL as string);

    logoutURL.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID as string);
    logoutURL.searchParams.set('returnTo', process.env.AUTH0_RETURN_TO_URL as string);

    return redirect(logoutURL.toString(), {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        },
    });
};
