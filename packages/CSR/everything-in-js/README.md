# How to centralize logic/style and other related dependencies into one javascript file

## Code Structure & Motivation

A typical client side rendering application is consisted by:

* a nearly blank html file, referencing
* a javascript entry file, which references
* all other javascript files rendering the application pages

The motivation to leave html blank, and move logic and style into javascript is to allow

* component reuse
* make style, content, behavior close to each other, for better maintainability
* declaractive style view enabled by framework like React

## DX Problems

Stylesheet can only be declared in `<style>` or referenced by `<link ref="stylesheet">`. Analyze the javascript file referenced to add `<link>` to html file will be expensive for dev server. Dev server should allow javascript to import css by insert `<link>` element dynamically to DOM.

Import css file does not provide type safety. Vite actually will not use tsc to check type compatiblity at all. It is DX problem still need to be solved by other solutions such as tailwind or styled component or generate d.ts file from css module.

Bundle all javascript as one takes time, to make typescript/javascript change take effect immediately, the bundling process should be avoided. Mordern browser has the capability to import individual javascript file as es6 module. Browser should import as if it is reading directly from the developer workspace, picking up any change just made.

However, if we actually import file one by one from node_modules, there will be problems:

* some 3rd party package file have circular dependency that browser can not handle
* some 3rd party package is written in commonjs format that browser can not import directly
* import a lot of files is slow

So to fix the problem, some "pre-bundling" need to be done to roll up the 3rd party packages in node_modules directory as one big javascript file in es6 module format. 

Pre-bundling will make mono repository hard to modify locally. Some package in node_modules is not 3rd party, but part of mono repository we are currently working on together. Vite need to know which package need to pre-bundle, which package should be imported file by file.

## UX Problems

Anything can be preloaded should be preloaded, such as `<link>` to stylesheet. Import statement in javascript should translate to `<link>` tag in html file.

Javascript files should be collected, bundled and minified to avoid browser taking too much time to download.

## Solution Walkthrough

There is nothing need to be configured in vite.config.ts. Vite has default setting desinged for CSR.

Unlike html dependencies, javascript reference everything with `import` statement. Import different file suffix has totally different effect.

```js
import './demo.css';
import { blue } from './example.module.css';
import demoJson from './demo.json';
import demoJsonUrl from './demo.json?url';
import demoJsonRaw from './demo.json?raw';
import './some-js/demo.js';
const pages = import.meta.globEager('./pages/**/*.tsx')
```

You can event import image in sub file `some-js/demo.js`

```js
import demoDynamicSvg from './demo-dynamic.svg';
const img = document.createElement('img');
img.setAttribute('src', demoDynamicSvg);
// img.setAttribute('src', new URL('./demo-dynamic.svg', import.meta.url).href);
img.setAttribute('width', '300');
document.body.appendChild(img);
```

How vite process the import is not a web standard. If we want to use the file in environment not controlled by vite, such as jest unit test, we might have trouble. So https://vitest.dev/ is invented to allow vite to run unit test as well.