import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        ssr: './server-entry.ts',
        outDir: '../dist'
    },
})