declare namespace App {
    export type AppLoadContext = import('@remix-run/cloudflare').AppLoadContext & {
        auth: import('remix-auth').Authenticator<import('remix-auth-auth0').Auth0Profile>;
        env: App.Env;
        sessionStorage: import('@remix-run/cloudflare').SessionStorage<
            import('@remix-run/cloudflare').SessionData,
            import('@remix-run/cloudflare').SessionData
        >;
    };
}
