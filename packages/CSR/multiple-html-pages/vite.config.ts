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
    transformIndexHtml: async (html, ctx) => {
      console.log('transform', ctx.filename);
      const header = await new Promise<string>((resolve, reject) => fs.readFile('layout/header.partial.html', 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }))
      html = html.replace('<body>', `<body>${header}`);
      return html;
    }
  }]
})