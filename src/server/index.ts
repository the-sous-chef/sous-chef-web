// import 'newrelic';
import * as Sentry from '@sentry/node';
import { CaptureConsole, Debug } from '@sentry/integrations';
import '@sentry/tracing';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEPLOYMENT,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new CaptureConsole(),
        process.env.NODE_ENV === 'development' ? new Debug() : null,
    ].filter(Boolean) as Sentry.NodeOptions['integrations'],
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
    tracesSampleRate: 1.0,
});

try {
    const { Server } = await import('src/server/main');

    const server = new Server();

    server.start();
} catch (e) {
    Sentry.captureException(e);
}
