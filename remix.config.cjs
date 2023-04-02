/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    // appDirectory: 'app',
    // assetsBuildDirectory: 'public/build',
    // publicPath: '/build/',
    devServerBroadcastDelay: 1000,
    future: {
        unstable_tailwind: true,
    },
    ignoredRouteFiles: ['**/.*'],
    server: './server.ts',
    serverBuildPath: 'functions/[[path]].js',
    serverConditions: ['worker'],
    serverDependenciesToBundle: 'all',
    serverMainFields: ['browser', 'module', 'main'],
    serverMinify: true,
    serverModuleFormat: 'esm',
    serverPlatform: 'neutral',
};
