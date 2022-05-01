import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
    build: {
        lib: {
            // will be loaded as window['example-lib']
            name: 'example-lib', 
            entry: './src/index.ts',
            formats: ['es', 'umd'],
            fileName: (format) => format === 'es' ? `esm/src/index.js` : `lib/src/index.js`,
        },
        outDir: 'dist',
        rollupOptions: {
            external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
        }
    },
})