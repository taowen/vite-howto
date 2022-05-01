# Vite How-to Guide

Modularization best practice to common web/fullstack development scenarios, applies to vue/react/... any framework

Just use vite (without plugins) and typescript, you can have a simple elegant workflow to develop and bundle for production.

I write this "Vite How-to Guide" after I have read tons of Webpack/SSR/Typescript guide on the internet. They try to tell you a series of command to follow blindly without a understanding of the essential problems. Also the solution is coupled with specific frontend framework and plugins to be "one key solution". But all those encapsulation makes debugging harder. In this guide, I will tell you how to write minimal configuration to do it yourself. You know what is the essential problem, you understand the theory, you copy paste the solution, then you can modify it confidently when problem arises.

The guide is still work in progress, you can join the discussion with author and readers https://github.com/taowen/vite-howto/discussions/1

* [Client Side Rendering](./packages/CSR/)
    * [How to collect static assets into a deployable bundle](./packages/CSR/html-dependencies/)
    * [How to make dependency between html and static assets less fragile](./packages/CSR/everything-in-js/)
    * [How to reduce homepage javascript bundle size](./packages/CSR/reduce-homepage-size/)
* [Server Side Rendering](./packages/SSR/)
    * [How to auto reload node.js server](./packages/SSR/auto-reload-node-server/)
    * [How to share index.html between client/server](./packages/SSR/share-index-html/)
    * [How to share render code between client/server](./packages/SSR/isomorphic-render/)
    * [How to generate a static website](./packages/SSR/generate-static-website/)
* [Publish/Consume via CDN (a.k.a Dynamic Linking)](./packages/DYNAMIC-LINKING)
    * [How to use big library via CDN](./packages/DYNAMIC-LINKING/use-big-library-via-cdn)
    * [How to publish hybrid npm package which can be used by both `<script>` and bundler](./packages/DYNAMIC-LINKING/hybrid-npm-package/)
    * [How to publish new version without asking application using the library to re-bundle and re-deploy](./packages/DYNAMIC-LINKING/remote-package/)
* [Publish/Consume via Mono Repository (a.k.a Static Linking)](./packages/STATIC-LINKING)
    * How to modify and test multiple typescript libraries within a mono repository
    * How to ensure new code end up in correct package within a mono repository

## You can play with these working demos

Download and install https://pnpm.io/

Run `pnpm install` at root to install for the first time. 

In each package, run `pnpm dev` to start dev server, run `pnpm build && pnpm preview` to start production server.