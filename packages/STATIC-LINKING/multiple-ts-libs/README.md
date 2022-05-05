# How to modify and test multiple typescript libraries within a mono repository

## Code Structure & Motivation

It is a mono repository containing 4 packages

* lib1: publish some function
* lib2: publish some function
* cli: reuse lib1/lib2 to provide a command line application
* app: use cli in its build process

lib1 and lib2 is written in TypeScript, cli is a node.js application that can not run TypeScript directly.

## DX Problems

TypeScript need to be transpiled in several places:

* bundling for web
* node.js executable
* jest test
* ...

We do not want to configure how to transpile typescript in every place.

When there are multiple typescript libraries within a mono repository, we might change several of them in the same time. It is slow to remember which one has modified and need to be re-compiled.

## UX Problems

N/A

## Solution Walkthrough

TypeScript has [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) 

### watch multiple typescript packages

libs.tsconfig.cjs.json

```json
{
    "files": [],
    "references": [{
        "path": "./lib1/tsconfig.cjs.json"
    }, {
        "path": "./lib2/tsconfig.cjs.json"
    }]
}
```

libs.tsconfig.json

```json
{
    "files": [],
    "references": [{
        "path": "./lib1/tsconfig.json"
    }, {
        "path": "./lib2/tsconfig.json"
    }]
}
```

One for CommonJS, one for ES6 Module. Then we use tsc to build & watch all of them

```json
{
    "name": "multiple-ts-libs",
    "private": true,
    "version": "1.0.0",
    "dependencies": {
    },
    "devDependencies": {
        "npm-run-all": "^4.1.5",
        "typescript": "^4.6.4"
    },
    "scripts": {
        "dev": "run-p dev:**",
        "dev:cjs": "tsc -b libs.tsconfig.cjs.json --watch",
        "dev:esm": "tsc -b libs.tsconfig.json --watch"
    }
}
```

Other places can simply reference the compiled output, do not need to worry about how to transpile TypeScript to JavaScript. For example

```js
#!/usr/bin/env node

const lib1 = require('@multiple-ts-libs/lib1');
const lib2 = require('@multiple-ts-libs/lib2');

console.log(`app => ${lib1.lib1Function()} ${lib2.lib2Function()}`)
```

We can write a cli, running in node.js, consuming lib1/lib2. If TypeScript has not been compiled, we need to use ts-node instead of node here.

We are not using vite here, because vite does not have the capability to watch multiple projects yet. Every vite.config.ts need a seperate vite process to watch.