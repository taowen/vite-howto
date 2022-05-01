import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [federation({
        name: 'publisher',
        filename: 'remoteEntry.js',
        exposes: {
            './minusButton': 'src/minusButton.ts',
            './plusButton': 'src/plusButton.ts'
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