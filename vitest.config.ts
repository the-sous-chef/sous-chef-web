/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import { default as react } from '@vitejs/plugin-react';
import { default as tsconfigPaths } from 'vite-tsconfig-paths';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        clearMocks: true,
        coverage: {
            reporter: ['cobertura'],
        },
        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
        globals: true,
        outputFile: { junit: 'junit.xml' },
        reporters: ['default', 'junit'],
        setupFiles: ['./vitest/vitest.setup.ts'],
    },
});
