# Vite How-to Guide

These are common questions in web development, they all can be solved with elegant vite/typescript configurations

* [Client Side Rendering](./packages/CSR/)
    * [How to reference stylesheet/image/video from index.html](./packages/CSR/html-dependencies/)
    * [How to reference stylesheet/image/video from javascript](./packages/CSR/everything-in-js/)
    * [How to reduce homepage size](./packages/CSR/reduce-homepage-size/)
* [Server Side Rendering](./packages/SSR/)
    * [How to auto reload node server](./packages/SSR/auto-reload-node-server/)
    * [How to share index.html between client/server](./packages/SSR/share-index-html/)
    * [How to share render code between client/server](./packages/SSR/isomorphic-render/)
* [Publish/Consume via CDN (Dynamic Linking)](./packages/DYNAMIC-LINKING)
    * [How to use big library via CDN](./packages/DYNAMIC-LINKING/use-big-library-via-cdn)
    * [How to publish hybrid npm package which can be used by both `<script>` and bundler](./packages/DYNAMIC-LINKING/hybrid-npm-package/)
    * [How to publish new version without asking application using the library to rebundle and redeploy](./packages/DYNAMIC-LINKING/remote-package/)
* [Publish/Consume via MonoRepo (Static Linking)](./packages/STATIC-LINKING)
    * How to compile several typescript packages concurrently
    * How to avoid the top integrating package to be over bloated

## You can play with these working demos

Download and install https://pnpm.io/

Run `pnpm install` at root to install for the first time. 

In each package, run `pnpm dev` to start dev server, run `pnpm build && pnpm preview` to start production server.