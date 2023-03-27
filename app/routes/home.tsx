import type { LoaderArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';

export const loader = async ({ request, context }: LoaderArgs) => {
    const profile = await (context as App.AppLoadContext).auth.isAuthenticated(request, {
        failureRedirect: '/',
    });

    return json({ profile });
};

export default function Home() {
    const { profile } = useLoaderData<typeof loader>();

    return (
        <>
            <Form action="/logout" method="post">
                <button>Log Out</button>
            </Form>

            <hr />

            <pre>
                <code>{JSON.stringify(profile, null, 2)}</code>
            </pre>
        </>
    );
}
