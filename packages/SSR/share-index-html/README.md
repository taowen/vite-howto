# How to allow client to introduce stylesheet

## Code Structure & Motivation

In previous example, client-entry.js and server-entry.ts shares nothing, it is just a reference relationship. In this example

* client-entry.js is replaced with index.html, client side is normal CSR setup
* server-entry.ts will use the client index.html to render its html

The motivation is to allow client application to control the html

* to enable HMR, browser will auto refresh, do not need to manually F5 refresh
* to inject `<link rel="stylesheet">` and other preload

This setup will be useful, if we distinguish server component and client component. It is not same page render twice, one in server, one in client. But it is a page rendered in two sequential stages, server renders what is can render, and client builds upon server generated html, and render client component.

## DX Problems

dev server should auto reload the node.js server when we have changed the source. nodemon can monitor soure code change and restart node process, but it takes time to restart. It would be nice to make the change without process restart.

dev server should auto reload the browser referenced client-entry.js. HMR should work.

## UX Problems

`vite build --ssr server/server-entry.ts --outDir dist` should package every server-entry.ts dependency (except node itself), so we do not need to `npm install` again when deploy.

`vite build --outDir dist/client` should package every index.html dependency, the javascripts should be collected, merged and minified. In this example, css in js will be translated as `<link>` inside html.

## Solution Walkthrough

client and server will share the same vite.confit.ts config. client and server will share index.html.

### build server

```
vite build --ssr server/server-entry.ts --outDir dist
```

Instead of write another vite.config.ts, we can use --ssr to override the client vite.config.ts entry (which is index.html) for server entry.

### build client

```
vite build --outDir dist/client
```

default entry is index.html. final dist directory contains both client / server


```
.
├── client
│   ├── assets
│   │   ├── index.499cda43.css
│   │   └── index.6540b25d.js
│   └── index.html
└── server-entry.js
```

client-entry.js is no longer client-entry.js in dist, vite bundled the javascript to assets/index.6540b25d.js, and rewrite the html to reflect the change.

### how server reference client in production

There are two things need to be referenced:

* server need to render based upon client/index.html
* server need to serve client/assets as http location

```ts
import express from 'express';
import path from 'path';
import server, { config } from './server';
import fs from 'fs';

config.indexHtml = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf-8');

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'client', 'assets')));
app.use(server);
app.listen(3000);
```

What is `config.indexHtml`, it is used by server side rendering:

```ts
import bodyParser from 'body-parser';
import express from 'express';

export const config = { indexHtml: '' }
const server = express.Router();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', async (req, resp) => {
    const markerPos = config.indexHtml.indexOf('<!--app-html-->');
    if (markerPos === -1) {
        throw new Error('maker not found, can not inject server generated content');
    }
    resp.write(config.indexHtml.substring(0, markerPos));
    // we can stream output here as well
    resp.write(`
    <header>
        <h1>HTML5 Example Page</h1>
    </header>
    <main></main>
    `);
    resp.write(config.indexHtml.substring(markerPos));
    resp.end();
})

export default server;
```

### development server

We also need to inject config.indexHtml in development mode

```ts
app.use(vite.middlewares);
app.all('/(.*)', async (req, resp) => {
    req.url = req.originalUrl;
    console.log(req.method, req.url);
    const { default: handle, config } = await vite.ssrLoadModule('./server/server.ts');
    config.indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    config.indexHtml = await vite.transformIndexHtml(req.url, config.indexHtml);
    handle(req, resp, (e) => {
        if (e) {
            vite.ssrFixStacktrace(e)
            console.error(e.stack)
            resp.status(500).end(e.stack);
        } else {
            resp.status(404).end();
        }
    });
})
```

vite.middlewares serves `client/client-entry.ts`

config.indexHtml read from filesystem and vite.transformIndexHtml inject HMR js code to allow hot reload in browser. No matter the change is client side or server side, the browser will auto reload.

### css in js

With index.html, we can import css in js

```ts
import './all.css';

export function render(): any {
    document.querySelector('main').innerHTML = 'hello world';
}
render();
```

It will end up as `<link rel="stylesheet" href="/assets/index.499cda43.css">` in the production build.