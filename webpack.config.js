const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WebpackCleanPlugin = require('webpack-clean-plugin');

const { NODE_ENV, PUBLIC_PORT = 8080 } = process.env;
const DIST = path.resolve('dist');
const HOST = '0.0.0.0';
const IS_DEVELOPMENT = NODE_ENV === 'development';
const PUBLIC_PATH = '/static/';
const STATIC_PATH = path.resolve(DIST, PUBLIC_PATH);

const client = {
    name: 'client',
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : 'source-map',
    target: 'web',
    devServer: {
        clientLogLevel: 'trace',
        compress: true,
        contentBase: STATIC_PATH,
        contentBasePublicPath: PUBLIC_PATH,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        host: HOST,
        hot: true,
        port: PUBLIC_PORT,
        publicPath: PUBLIC_PATH,
        sockPort: PUBLIC_PORT,
    },
    entry: {
        client: [
            './src/client/index.tsx',
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, /__tests__/],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: IS_DEVELOPMENT ? 'tsconfig.dev.json' : 'tsconfig.json',
                            onlyCompileBundledFiles: true,
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                parallel: 2,
            }),
        ],
        runtimeChunk: 'single',
        sideEffects: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            },
        },
    },
    output: {
        filename: IS_DEVELOPMENT ? '[name].js' : '[name].[contenthash].js',
        path: STATIC_PATH,
        publicPath: PUBLIC_PATH,
    },
    plugins: [
        new Dotenv(),
        new SentryPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'Sous Chef',
            project: process.env.AA_NAME,
            release: process.env.SENTRY_RELEASE,
            // webpack specific configuration
            include: '.',
            ignore: ['node_modules', 'webpack.config.js'],
        }),
        new WebpackAssetsManifest({
            entrypoints: true,
            publicPath: PUBLIC_PATH,
        }),
        new WebpackCleanPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
        }),
        IS_DEVELOPMENT ? null : new webpack.ids.HashedModuleIdsPlugin(),
    ].filter(Boolean),
    resolve: {
        alias: {
            static: STATIC_PATH,
            'react-dom': '@hot-loader/react-dom',
        },
        fallback: {
            crypto: false,
            http: false,
            https: false,
            util: false,
        },
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },
};

const server = {
    name: 'server',
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : 'source-map',
    target: 'node',
    entry: {
        server: './src/server/index.ts',
    },
    externals: [nodeExternals()],
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                parallel: 2,
            }),
        ],
        sideEffects: true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    output: {
        filename: '[name].js',
        library: 'server',
        libraryTarget: 'commonjs2',
        path: DIST,
        publicPath: PUBLIC_PATH,
    },
    plugins: [
        new Dotenv(),
        new NodemonPlugin({
            ext: 'js,ts,tsx,json,yml',
            ignore: [
                '.git',
                'dist',
                'node_modules',
            ],
            nodeArgs: ['--max-old-space-size=8192', '--inspect=0.0.0.0:9229'],
            verbose: true,
        }),
        new SentryPlugin({
            release: process.env.VERSION,
            include: DIST,
        }),
        new WebpackCleanPlugin(),
        new webpack.DefinePlugin({
            PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
        }),
        new webpack.WatchIgnorePlugin({
            paths: [
                'node_modules',
                '__tests__',
                '__mocks__',
            ],
        }),
        IS_DEVELOPMENT ? null : new webpack.ids.HashedModuleIdsPlugin(),
    ].filter(Boolean),
    resolve: {
        alias: {
            static: STATIC_PATH,
        },
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, /__tests__/],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: IS_DEVELOPMENT ? 'tsconfig.dev.json' : 'tsconfig.json',
                            onlyCompileBundledFiles: true,
                        },
                    },
                ],
            },
        ],
    },
};

module.exports = [server, client];
module.exports.parallelism = 2;
