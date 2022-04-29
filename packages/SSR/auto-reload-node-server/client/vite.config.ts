import { defineConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig({
    ...sharedConfig,
    build: {
        lib: {
            entry: './client-entry.js',
            formats: ['es'],
            fileName: () => 'client-entry.js'
        },
        outDir: '../dist/client'
    },
})