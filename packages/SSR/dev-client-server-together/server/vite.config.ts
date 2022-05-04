import { defineConfig, mergeConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig(mergeConfig(sharedConfig, {
    build: {
        ssr: './server-entry.ts',
        outDir: '../dist'
    },
}))