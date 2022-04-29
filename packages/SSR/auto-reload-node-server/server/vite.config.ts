import { defineConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig({
    ...sharedConfig,
    build: {
        ssr: './server-entry.ts',
        outDir: '../dist'
    },
})