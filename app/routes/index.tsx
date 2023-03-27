import type { LoaderArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';

type LoaderError = { message: string } | null;
export const loader = async ({ request, context }: LoaderArgs) => {
    const { auth, sessionStorage } = (context as App.AppLoadContext);

    await auth.isAuthenticated(request, { successRedirect: '/private' });
    
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const error = session.get(auth.sessionErrorKey) as LoaderError;

    return json({ error });
};

export default function Index() {
    const { error } = useLoaderData<typeof loader>();

    return (
        <Form action="/auth0" method="post">
            {error ? <div>{error.message}</div> : null}
            <button>Sign In with Auth0</button>
        </Form>
    );
}
