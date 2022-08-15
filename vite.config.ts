import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/guide/backend-integration.html
// eslint-disable-next-line import/no-default-export
export default defineConfig({
    build: {
        manifest: true,
        rollupOptions: {
            input: 'src/client/index.tsx',
        },
    },
    plugins: [react()],
});
