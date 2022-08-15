import 'source-map-support/register';
// import 'newrelic';

try {
    const { Server } = await import('src/server/main');

    const server = new Server();

    server.start();
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
}
