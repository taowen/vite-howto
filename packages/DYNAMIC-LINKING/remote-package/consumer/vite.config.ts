import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [federation({
        remotes: {
            '@publisher': 'http://localhost:3001/assets/remoteEntry.js'
        },
        shared: ['remote-package-shared-store']
    })],
    build: {
        target: 'esnext',
        minify: false,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                minifyInternalExports: false
            }
        }
    },
    optimizeDeps: {
        include: ['remote-package-shared-store']
    }
})