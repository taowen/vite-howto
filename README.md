# Vite How-to Guide

how-to guide for CSR / SSR / Runtime Dynamic Linking / Mono Repository Workspace

* [Client Side Rendering](./packages/CSR/)
    * [Html dependencies](./packages/CSR/html-dependencies/)
    * [Everything in js](./packages/CSR/everything-in-js/)
    * [Reduce homepage size](./packages/CSR/reduce-homepage-size/)
* [Server Side Rendering](./packages/SSR/)
    * [Auto reload node server](./packages/SSR/auto-reload-node-server/)
    * [Share index.html](./packages/SSR/share-index-html/)
    * [Isomorphic render](./packages/SSR/isomorphic-render/)
* [Runtime Dynamic Linking](./packages/RDL)
    * [Use big library via CDN](./packages/RDL/use-big-library-via-cdn)

run `pnpm install` to install dependencies. 

in each package, run `pnpm dev` to start dev server, run `pnpm build && pnpm preview` to start production server.