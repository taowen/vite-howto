import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        assetsInlineLimit: 0,
        minify: false
    }
})