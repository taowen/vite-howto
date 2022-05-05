# How to publish library with stylesheet and wasm dependencies

## Code Structure & Motivation

Application is splited into libraries. 

* lib-publisher: a library provides some component
* lib-consumer: a application using the lib-publisher components

The motivation is maintainability, let some code has clear ownership. Also the lib-publisher might be reused in the future. Two applications can use different version of the lib.

## DX Problems

Vite extended the javascript import statement capability. To support client side rendering, javascript file can import css, wasm, and all sorts of static assets. We want to be able to publish library with stylesheet and wasm dependencies.

## UX Problems

The dependencies should be served to end user in optimal way. Stylesheet should be preloaded via `<link>`, wasm file should not be inlined as base64 (which is too large).

## Solution Walkthrough

### vite library mode

Vite has direct support of library mode. lib-publisher/vite.config.ts

```ts
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: () => 'index.js'
        },
        outDir: 'dist',
        assetsInlineLimit: 0,
    },
    plugins: []
})
```

index.ts imported both demo.module.css and demo.wasm. Vite compiled the index.js as

```js
var initWasm = (opts) => initWasm$1(opts, "data:application/wasm;base64,AGFzbQEAAAABh4CAgAABYAJ/fwF/A4KAgIAAAQAFg4CAgAABABEHkICAgAACBm1lbW9yeQIAA2FkZAAAComAgIAAAQcAIAEgAGoLC7aEgIAAAgBBgIDAAAsIAQAAAAIAAAAAQYiAwAALnAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkYCAgAAEbmFtZQGGgICAAAEAA2FkZAD+gICAAAlwcm9kdWNlcnMCCGxhbmd1YWdlAQRSdXN0BDIwMTgMcHJvY2Vzc2VkLWJ5AwVydXN0Yx0xLjM0LjEgKGZjNTBmMzI4YiAyMDE5LTA0LTI0KQZ3YWxydXMFMC43LjAMd2FzbS1iaW5kZ2VuEjAuMi40NSAoNmZhNmFmMjNiKQ==");
const blue = "_blue_6duqs_1";
const red = "_red_6duqs_5";
var demo_module = {
  blue,
  red
};
async function render() {
  const { add } = await initWasm();
  console.log("1+1", add(1, 1));
  return `<div class="${blue}">hello</div><div class="${red}">world</div>`;
}
export { render };
```

wasm is inlined as base64, as vite do not know where the wasm will end up in the application, so vite have to inline it to be portable.

css module class is inlined in the javascript, but the actual css content is placed in dist/style.css.

The user of the lib-publisher, need to import style.css manually

```html
<body>
    <main></main>
    <script type="module">
        import { render } from '@library-with-assets/lib-publisher';
        import '@library-with-assets/lib-publisher/dist/style.css';
        (async() => {
            document.querySelector('main').innerHTML = await render();
        })();
    </script>
</body>
```

### mono repository

If we do not publish / consume via NPM, we do not need make the library a actual library. Packages within a mono repository can be bundled by vite in one step. In src-publisher, we export the source code directly without compiling and bundling. The src-consumer will use vite to bundle both its own code and code of src-publisher.

src-publisher/package.json

```json
{
    "name": "@library-with-assets/src-publisher",
    "private": true,
    "version": "1.0.0",
    "main": "src/index.ts"
}
```

This way, src-consumer do not need to import style.css manually, css in js just works.

```html
<body>
    <main></main>
    <script type="module">
        import { render } from '@library-with-assets/src-publisher';
        (async() => {
            document.querySelector('main').innerHTML = await render();
        })();
    </script>
</body>
```

run `vite build` at src-consumer, will include static assets in bundle as expected, wasm is no longer inlined as base64:

```
dist
├── assets
│   ├── demo.47f9337a.wasm
│   ├── index.9bc889cd.js
│   └── index.bd1b7d52.css
└── index.html
```
