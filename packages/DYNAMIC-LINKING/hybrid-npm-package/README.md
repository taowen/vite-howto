# How to publish hybrid npm package which can be used by both `<script>` and bundler

## Code Structure & Motivation

How to build a library for both NPM and CDN? So that

* provide proper type definition
* can be npm installed
* can run in node.js for unit testing
* can run in browser with old school script tag
* can run in browser as es module
* can be bundled by webpack/vite with tree shaking

We need to build three things

* package.json main: it should be UMD javascript file for both node.js and old school script tag.
* package.json module: it should be ESM javascript file for bundler tree shaking and modern browser
* package.json typings: for typecript

## DX Problem

During development, we want the library written in typescript to recompile fast. Cold start tsc is slow, better to keep tsc live in memory.

The unit test can be run continuously, once the code changed, the tests affected can be re-executed to verify the change.

Typescript compilation should be incremental, only compile the file actually modified.

## UX Problem

The javascript files should be rolled up as one big file to reduce network download time

We do not want test file packaged into production npm library

## Solution Walkthrough

### dev server

We use tsc during development. It has two modes

* `pnpm dev` watches the change, and run jest automatically
* `pnpm test` recompile and run jest for one time

Watch is implemented by tsc and jest:

```json
"dev": "run-p dev:**",
"dev:cjs": "tsc -b tsconfig.cjs.json --watch",
"dev:esm": "tsc -b --watch",
"dev:test": "pnpm jest --watchAll --roots=dist/lib"
```

`run-p` is provided by npm-run-all to run several commands in parallel. Because tsc and jest both live in memory, the re-compilation process is very fast.

### two tsconfig.json

```json
{
    "compilerOptions": {
        "composite": true,
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "incremental": true,
        "strict": true,
        "sourceMap": true,
        "declaration": true,
        "declarationDir": "dist/typings",
        "outDir": "dist/esm",
        "types": ["jest"],
        "lib": ["ESNext"]
    },
    "include": [
        "src/**/*.ts"
    ]
}
```

By default, tsc emits es6 module to dist/esm, and typings to dist/typings

`incremental: true` to speed up re-compilation.

There is another tscofnig.cjs.json

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "dist/lib"
    }
}
```

it emits to dist/lib with cjs format.

### publish hybrid npm package

package.json need following keys to make it hybrid

```json
"main": "dist/lib/src/index.js",
"module": "dist/esm/src/index.js",
"typings": "dist/typings/src/index.d.ts",
"exports": {
    ".": {
        "require": "./dist/lib/src/index.js",
        "import": "./dist/esm/src/index.js"
    }
}
```

different execution environment will read from different key to pick up the format they can use.

### build for production

We need to

* roll up javascripts into one big file
* build UMD format, so that legcay browser can consume the library via CDN

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
    build: {
        lib: {
            // will be loaded as window['example-lib']
            name: 'example-lib', 
            entry: './src/index.ts',
            formats: ['es', 'umd'],
            fileName: (format) => format === 'es' ? `esm/src/index.js` : `lib/src/index.js`,
        },
        outDir: 'dist',
        rollupOptions: {
            external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
        }
    },
})
```

By default vite will bundle all dependencies, we ned to externalize them, so that only our own files get rolled up.

Unlike tsc, vite does not compile every file under src, it only bundle the files referenced by src/index.ts. So that tests are ignored.

package.json do not need be changed, as the output file is in the same path.