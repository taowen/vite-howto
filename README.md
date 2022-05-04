# Vite How-to Guide

There are plenty of tutorials on how to use vite to compile code written in latest and hottest technology, this guide is different. It is about how to split application into files/packages, how to use **TypeScript** to ensure compatibility, how to use **Vite** to link them back (either statically or dynamically). Demo code is written in plain old javascript using vanilla web api.

I write this "Vite How-to Guide" after I have read tons of Webpack/SSR/Typescript guide on the internet. They try to tell you a series of command to follow blindly without a understanding of the essential problems. Also the solution is coupled with specific frontend framework and plugins to be "one key solution". But all those encapsulation makes debugging harder. In this guide, I will tell you how to write minimal vite (without plugins) and typescript configuration to do it yourself. You know what is the essential problem, you understand the theory, you copy paste the solution, then you can modify it confidently when problem arises.

* Client Side Rendering
    * [How to only collect used static assets into a deployable bundle](./packages/CSR/html-dependencies/)
    * [How to centralize logic/style and other related dependencies into one javascript file](./packages/CSR/everything-in-js/)
    * [How to reduce homepage javascript bundle size](./packages/CSR/reduce-homepage-size/)
    * [How to write a website in multiple html files](./packages/CSR/multiple-html-pages/)
* Server Side Rendering
    * [How to auto reload node.js server](./packages/SSR/auto-reload-node-server/)
    * [How to allow client to introduce stylesheet](./packages/SSR/share-index-html/)
    * [How to share render code between client/server](./packages/SSR/isomorphic-render/)
    * [How to generate a static website](./packages/SSR/generate-static-website/)
* Publish/Consume via CDN (a.k.a Dynamic Linking)
    * [How to consume big library via CDN](./packages/DYNAMIC-LINKING/use-big-library-via-cdn)
    * [How to publish hybrid npm package which can be used by both `<script>` and bundler](./packages/DYNAMIC-LINKING/hybrid-npm-package/)
    * [How to publish new version without asking application using the library to re-bundle and re-deploy](./packages/DYNAMIC-LINKING/remote-package/)
* Publish/Consume via Mono Repository (a.k.a Static Linking)
    * [How to modify and test multiple typescript libraries within a mono repository](./packages/STATIC-LINKING/multiple-ts-libs/)
    * [How to ensure new code end up in correct package within a mono repository](./packages/STATIC-LINKING/inversion-of-control/)

The guide is still work in progress, you can join the discussion with author and readers https://github.com/taowen/vite-howto/discussions/1

## Problems are more important than the solutions

For each topic, there are 4 parts

* The desired source code file/directory structure, and the motivation
* What are the developer experience problems if structured this way
* What are the user experience problems if structured this way
* Solution walk through

Solution tend to change rapidly, for example webpack evolves into vite. 
But some problems are decades old, they seldom change.
Understand the problems allow us to pick up new framework/tool faster, because you know what you are looking for.

## You can reuse these examples as starter

Download and install https://pnpm.io/ Run `pnpm install` to install dependencies of all packages in the workspace. 

In each package, run `pnpm dev` to start dev server, run `pnpm build && pnpm preview` to start production server. Make some changes to deepen your understanding.

Every example is a starter template you can reuse by copy & paste. It works better this way, than reuse by framework with lots of options & callbacks.