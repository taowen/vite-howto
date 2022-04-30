# vite-howto

how-to guide for CSR/SSR/CDN dev/production configuration

* [Client Side Rendering](./packages/CSR/)
    * [Html dependencies](./packages/CSR/html-dependencies/)
    * [Everything in js](./packages/CSR/everything-in-js/)
    * [Reduce homepage size](./packages/CSR/reduce-homepage-size/)
* [Server Side Rendering](./packages/SSR/)
    * [Auto reload node server](./packages/SSR/auto-reload-node-server/)
    * [Share index.html](./packages/SSR/share-index-html/)
    * [Isomorphic render](./packages/SSR/isomorphic-render/)

run `pnpm install` to install dependencies. in each package, run `pnpm dev` for dev server, run `pnpm build && pnpm preview` for production server.