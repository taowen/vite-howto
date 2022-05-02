# How to only collect used static assets into a deployable bundle

## Code Structure & Motivation

a html file called `index.html`, it references stylesheet / javascript / images / videos from local disk

## DX Problems

The file on the disk might need some processing:

* typescript: need to be compiled to javascript
* sass/less: need to be compiled to css

Change on the disk should be picked up automatically. Otherwise, the workflow will be painful:

* change the source code
* re-compile
* stop dev server
* start dev server
* refresh browser page

Vite need to provide a illusion, that it reads directly from the disk. As long as you change the source, everything should be updated to reflect the change. You should not need to be aware the existence of compilation cache.

Also the config such as `vite.config.ts` itself need to be automatically update. You do not need to restart `vite dev` after `vite.config.ts` changed.

## UX Prblems

There are many user experience problems with html:

* link to a file might be broken
* too many files to download
* referenced javascript / css is not minified

There are many ways to express file dependency:

* `<script>`
* `<link>`
* `<img>`
* `<video>`
* `new URL('./demo-dynamic.svg', import.meta.url)`
* `@import`

And the href could be

* `http://baidu.com/abcd`: full url
* `/mov_bbb.mp4`: relative to the root of vite project
* `../mov_bbb.ogg`: relative to current file

All dependencies should be collected, merged and minified to produce a deployable production bundle.

## Solution Walkthrough

Nothing need to be configured, vite default configuration assumes `index.html` as the entry point, and it takes care of everything from there.

```ts
import path from 'path'
import { defineConfig } from 'vite'

// vite.config.ts default to use index.html as input
module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  }
})
```

Only thing developer needs to do is to write standard compliant HTML/JavaScript/CSS file.