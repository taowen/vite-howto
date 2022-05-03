import path from 'path'
import { defineConfig } from 'vite'

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about', 'about.html'),
        contactus: path.resolve(__dirname, 'contactus.html'),
      }
    }
  }
})