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
                exclude: ['node_modules', '.git', 'src/client'],
                include: [
                    '@types',
                    'src/server',
                    'src/shared',
                    'src/client/ssr.tsx',
                ],
            } : undefined,
        },
        optimizeDeps: {
            include: ['react/jsx-runtime'],
        },
        plugins: [
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.DEBUG_BUILD': JSON.stringify(process.env.DEBUG_BUILD),
                    'process.env.DEPLOYMENT': JSON.stringify(process.env.DEPLOYMENT || 'production'),
                    'process.env.LOGROCKET_ACCOUNT_ID': JSON.stringify(process.env.LOGROCKET_ACCOUNT_ID),
                    'process.env.NODE_ENV': JSON.stringify(mode),
                    'process.env.RELEASE': JSON.stringify(process.env.RELEASE),
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
