# Vite How-to Guide

Modularization best practice to common web development scenarios, applies to vue/react/... any framework

I write this "Vite How-to Guide" after I have read tons of Webpack/SSR/Typescript guide on the internet. They try to tell you a series of command to follow blindly without a understanding of the essential problems. Also the solution is coupled with specific frontend framework and plugins to be "one key solution". But all those encapsulation makes debugging harder. In this guide, I will tell you how to write minimal vite (without plugins) and typescript configuration to do it yourself. You know what is the essential problem, you understand the theory, you copy paste the solution, then you can modify it confidently when problem arises.

The guide is still work in progress, you can join the discussion with author and readers https://github.com/taowen/vite-howto/discussions/1

* Client Side Rendering
    * [How to collect static assets into a deployable bundle](./packages/CSR/html-dependencies/)
    * [How to centralize logic/style into one javascript file](./packages/CSR/everything-in-js/)
    * [How to reduce homepage javascript bundle size](./packages/CSR/reduce-homepage-size/)
    * How to split application to multiple html pages
* Server Side Rendering
    * [How to auto reload node.js server](./packages/SSR/auto-reload-node-server/)
    * [How to share index.html between client/server](./packages/SSR/share-index-html/)
    * [How to share render code between client/server](./packages/SSR/isomorphic-render/)
    * [How to generate a static website](./packages/SSR/generate-static-website/)
* Publish/Consume via CDN (a.k.a Dynamic Linking)
    * [How to use big library via CDN](./packages/DYNAMIC-LINKING/use-big-library-via-cdn)
    * [How to publish hybrid npm package which can be used by both `<script>` and bundler](./packages/DYNAMIC-LINKING/hybrid-npm-package/)
    * [How to publish new version without asking application using the library to re-bundle and re-deploy](./packages/DYNAMIC-LINKING/remote-package/)
* Publish/Consume via Mono Repository (a.k.a Static Linking)
    * [How to modify and test multiple typescript libraries within a mono repository](./packages/STATIC-LINKING/multiple-ts-libs/)
    * How to ensure new code end up in correct package within a mono repository

## What we use vite for

* Split application into files/packages, and link them back (either statically or dynamically)
* Dev server to compile and auto reload changes
* Build deployable bundle for production

Vite provides a wide range of modularization choices, with optimal user experience and developer experience.
End user will not see the page load longer, because you have modularized the code.
Developer will not suffer from long build waiting, becuase you have modularized the code.

## You can play with these working demos

Download and install https://pnpm.io/

Run `pnpm install` at root to install for the first time. 

In each package, run `pnpm dev` to start dev server, run `pnpm build && pnpm preview` to start production server.