import type { ActionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

export const loader = async () => redirect('/');

export const action = async ({
    request,
    context,
}: ActionArgs) => (context as App.AppLoadContext).auth.authenticate('auth0', request);
