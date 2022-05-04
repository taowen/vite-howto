import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        assetsInlineLimit: 0
    },
    resolve: {
        alias: {
            '@library-with-assets/publisher': '@library-with-assets/publisher/src/index'
        }
    }
})