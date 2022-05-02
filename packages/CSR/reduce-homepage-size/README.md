# How to reduce homepage javascript bundle size

## Code Structure & Motivation

Instead of putting all pages in one javascript, we organize the javascript files along with page boundary.
There should be standard alone file for each page as its entry point.
The motivation is to know each page dependencies, to reduce homepage javascript bundle size.

## DX Problem

Declaring what is page should be lightweight, instead of using some out of band information, in javascript es6 dynamic `import()` is standard compliant to avoid fragmentation.

Declaring dependencies manually is annonying. Page dependencies should be infered from javascript source code.

Two page might have common dependencies, should have preset to deal with these common dependencies. Developer want to set a strategy, and let vite to arrange code into different chunks automatically. 

## UX Problem

Assets and javascripts should be bundled if possible. Even split into pages requires some dynamic loading, but separate file should be kept minimal.

One page might have multiple files (stylesheet, js, etc), they should be loaded concurrently if possible.

Stylesheet should be loaded before the page javascript renders to avoid "Flash of unstyled content" ( FOUC ) problem.

## Solution Walkthrough

Luckily, we do not need to manually maintain the page dependencies. We only need to use 

```js
window.$Page1 = () => import('./pages/page1.js');
window.$Page2 = () => import('./pages/page2.js');
```

instead of 

```js
import Page1 from './pages/page1.js';
import Page2 from './pages/page2.js';
```

the dependencies of page1 and page2 will be excluded from the homepage. When we render the page, we just need await

```js
window.$render = async (pageProvider) => {
    const { default: render } = await pageProvider();
    render();
}
```

`$render($Page1)` will download the code required if not downloaded before, and evaluate the javascript return the module. we use the render function exported default to render.

Vite takes this pattern a step further to allow scan the filesystem:

```js
window.$AllPages = import.meta.glob('./pages/**/*.js');
```

It will contain

```js
{
    './pages/page2.js': () => import('./pages/page2.js'),
    './pages/page1.js': () => import('./pages/page1.js'),
}
```

So that we do not need to write annoying `() => import(xxx)` by hand.

vite.config.ts do not need to be modified to make code splitting work. But `build.rollupOptions.output.manualChunks` can be used to control the details.

```ts
// vite.config.ts
import { splitVendorChunkPlugin } from 'vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [splitVendorChunkPlugin()]
})
```

can be used to split vendor chunk out.


