import 'dotenv/config';
import { defineConfig, UserConfig } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { default as react } from '@vitejs/plugin-react';
import { default as replace } from '@rollup/plugin-replace';
import { default as tsconfigPaths } from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }): UserConfig => {
    const dev = mode === 'development';
    const isWin = process.platform === 'win32';
    const port = parseInt(process.env.PORT as string, 10);

    return {
        css: {
            devSourcemap: true,
        },
        build: {
            manifest: true,
            outDir: 'dist/client',
            rollupOptions: {
                external: ['newrelic'],
                input: 'src/client/browser.tsx',
            },
            sourcemap: true,
            target: 'es2020',
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
                treeShaking: true,
            },
            include: ['react/jsx-runtime'],
        },
        plugins: [
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
                    'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
                    'process.env.DEBUG_BUILD': JSON.stringify(process.env.DEBUG_BUILD),
                    'process.env.DEPLOYMENT': JSON.stringify(process.env.DEPLOYMENT || 'production'),
                    'process.env.LOGROCKET_ACCOUNT_ID': JSON.stringify(process.env.LOGROCKET_ACCOUNT_ID),
                    'process.env.NODE_ENV': JSON.stringify(mode),
                    'process.env.RELEASE': JSON.stringify(process.env.RELEASE),
                    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
                },
            }),
            react(),
            tsconfigPaths(),
            viteExternalsPlugin({
                newrelic: 'newrelic',
                // TODO externalize react?
            }),
        ],
        server: {
            port,
            host: '0.0.0.0',
            hmr: {
                port,
                host: process.env.HOSTNAME,
                protocol: 'ws',
            },
            watch: dev
                ? {
                      usePolling: isWin,
                  }
                : undefined,
        },
    };
});
