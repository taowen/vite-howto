# Share index.html

`index.html` is very important for vite. without `index.html`

* vite can not inject HMR script to auto reload browser with latest code
* vite can not inject css to `<head>` with `<link>`

So we need to bring `index.html` back and share it in both client and server.

## build server

```
vite build --ssr server/server-entry.ts --outDir dist
```

Instead of write another vite.config.ts, we can use --ssr to override the client vite.config.ts entry (which is index.html) for server entry.

## build client

```
vite build --outDir dist/client
```

default entry is index.html. final dist with both client / server


```
.
├── client
│   ├── assets
│   │   ├── index.499cda43.css
│   │   └── index.6540b25d.js
│   └── index.html
└── server-entry.js
```

instead of client-entry.js, vite bundled the javascript to assets/index.6540b25d.js, and rewrite the html to reflect the change.

## how server reference client in production

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

## development server

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

## css in js

With index.html, we can import css in js

```ts
import './all.css';

export function render(): any {
    document.querySelector('main').innerHTML = 'hello world';
}
render();
```

It will end up as `<link rel="stylesheet" href="/assets/index.499cda43.css">` in the production build.