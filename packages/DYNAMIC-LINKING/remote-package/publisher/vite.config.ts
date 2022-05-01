import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import fs from 'fs'

const exposes: Record<string, string> = {};
for (const file of fs.readdirSync('src')) {
    if (file.endsWith('.ts')) {
        exposes[`./${file.replace('.ts', '')}`] = `src/${file}`;
    }
}

export default defineConfig({
    plugins: [federation({
        filename: 'remoteEntry.js',
        // exposes: {
        //     './minusButton': 'src/minusButton.ts',
        //     './plusButton': 'src/plusButton.ts'
        // },
        exposes,
        shared: ['remote-package-shared-store']
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