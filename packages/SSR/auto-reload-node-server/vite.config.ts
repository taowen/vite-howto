import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        ssr: './server/server-entry.ts',
        outDir: 'dist'
    },
})