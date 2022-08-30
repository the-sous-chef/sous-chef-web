import 'dotenv/config';
import { defineConfig, UserConfig } from 'vite';
import { default as react } from '@vitejs/plugin-react';
import { default as replace } from '@rollup/plugin-replace';
import { default as run } from '@rollup/plugin-run';
import { default as tsconfigPaths } from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }): UserConfig => {
    const dev = mode === 'development';
    const isWin = process.platform === 'win32';

    return {
        build: {
            outDir: 'dist/server',
            rollupOptions: {
                external: ['newrelic.cjs', /node_modules/],
                input: 'src/server/index.ts',
                output: {
                    format: 'es',
                },
            },
            sourcemap: true,
            ssr: true,
            target: 'esnext',
            watch: dev ? {
                chokidar: {
                    usePolling: isWin,
                },
                exclude: ['node_modules/**', 'src/client/**'],
            } : undefined,
        },
        optimizeDeps: {
            // esbuildOptions: {
            //     // @ts-expect-error typing error with plugin
            //     plugins: [esbuildPluginPino({
            //         transports: ['pino-pretty', path.resolve(__dirname, 'src/shared/sentryTransport.ts')],
            //     })],
            // },
            include: ['react/jsx-runtime'],
        },
        plugins: [
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.DEPLOYMENT': JSON.stringify(process.env.DEPLOYMENT || 'production'),
                    'process.env.NODE_ENV': JSON.stringify(mode),
                    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
                },
            }),
            tsconfigPaths(),
            react(),
            dev && run({
                execArgv: ['--inspect=0.0.0.0:9229', '--max-old-space-size=4096'],
            }),
        ],
    };
});
