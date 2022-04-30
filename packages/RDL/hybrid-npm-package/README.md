# Hybrid npm package

How to build a library for NPM and CDN? So that

* provide proper type definition
* can run in node.js for unit testing
* can run in browser with old school script tag
* can run in browser as es module
* can be bundled by webpack/vite with tree shaking

We need to build three things

* package.json main: it should be UMD javascript file for both node.js and old school script tag.
* package.json module: it should be ESM javascript file for bundler tree shaking and modern browser
* package.json typings: for typecript
* we also need to rollup javascript files into a single file to improve the performance in browser