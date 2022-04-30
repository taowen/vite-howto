import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [{
        name: 'provide monaco',
        load(id) {
            if (id === '@monaco') {
                return 'export default window.monaco'
            }
        }
    }],
    resolve: {
        alias: {
            'monaco-editor': '@monaco'
        }
    }
})