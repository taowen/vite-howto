import path from 'path'
import { defineConfig } from 'vite'
import fs from 'fs';

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about', 'about.html'),
        contactus: path.resolve(__dirname, 'contactus.html'),
      }
    }
  },
  plugins: [{
    name: 'server side include',
    transformIndexHtml(html, ctx) {
      console.log('transform', ctx.filename);
      html = html.replace('<body>', `<body>${fs.readFileSync('layout/header.partial.html', 'utf-8')}`);
      return html;
    }
  }]
})