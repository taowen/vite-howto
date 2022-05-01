import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    cacheDir: 'node_modules/.cacheDir',
    plugins: [federation({
        name: 'consumer',
        filename: 'remoteEntry.js',
        remotes: {
            '@publisher': 'http://localhost:3001/assets/remoteEntry.js'
        },
        shared: {
            'remote-package-shared-store': {
                singleton: true
            },
            '@vue/reactivity': {
                singleton: true
            }
        }
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
        exclude: ['remote-package-shared-store']
    }
})