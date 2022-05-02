import { defineConfig } from 'vite'
import path from 'path'

module.exports = defineConfig({
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          contactus: path.resolve(__dirname, 'contactus.html'),
        }
      }
    }
  })