```ts
// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
})
```

Above it is the default, we do not need to write. Vite assumes we are doing client side rendering application, not SSR, not build for CDN. When `vite dev` it will start from `index.html`, when `vite build` it also scan dependencies starting from `index.html`. The html file is not only your CSR homepage, it is also a configuration file for vite, to describe its dependencies.