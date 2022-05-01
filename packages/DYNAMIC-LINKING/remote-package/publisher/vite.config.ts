import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [federation({
        filename: 'remoteEntry.js',
        exposes: {
            './minusButton': 'src/minusButton.ts',
            './plusButton': 'src/plusButton.ts'
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
    }
})