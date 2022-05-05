import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: () => 'index.js'
        },
        outDir: 'dist',
        assetsInlineLimit: 0,
    },
    plugins: []
})