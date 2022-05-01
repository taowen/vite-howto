import { defineConfig, mergeConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig(mergeConfig(sharedConfig, {
    build: {
        lib: {
            entry: './client-entry.js',
            formats: ['es'],
            fileName: () => 'client-entry.js'
        },
        outDir: '../dist/client'
    },
}))