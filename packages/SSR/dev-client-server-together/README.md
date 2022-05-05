# How to develop client and server together

## Code Structure & Motivation

This is a simplest setup of server side rendering:

* server directory: server-entry.ts executed in node.js environment, listen at http://localhost:3000 port
* client directory: client-entry.js is imported from browser, the html is rendered by server

The motivation to split code into two parts, is to move some computation from client to server, so that:

* access to internal backend api
* less traffic over the internet
* less rendering code need to be run in slow client device

We do not run same code between client and server yet, let's start from a simple scenario. server-entry.ts is like a traditional java application rendering html, client-entry is like a tranditional javascript which uses jquery.

## DX Problems

dev server should auto reload the node.js server when we have changed the source. nodemon can monitor soure code change and restart node process, but it takes time to restart. It would be nice to make the change without process restart.

dev server should auto reload the browser referenced client-entry.js. HMR will not work yet, it will be covered in next example.

## UX Problems

`vite build server` should package every server-entry.ts dependency (except node itself), so we do not need to `npm install` again when deploy.

`vite build client` should package every client-entry.js dependency, the javascripts should be collected, merged and minified. In this example, css in js is not possible yet, it will be covered in next example.

## Solution Walkthrough

### build server

server/vite.config.ts

```ts
import { defineConfig, mergeConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig(mergeConfig(sharedConfig, {
    build: {
        ssr: './server-entry.ts',
        outDir: '../dist'
    },
}))
```

will bundle the `server/server-entry.ts` to `dist/server-entry.js` with everything it referenced (except node.js standard library). It is in commonjs format, ready to be executed in node.js environment. `build.ssr` is provided by vite to build node.js server.

### build client

client/vite.config.ts

```ts
import { defineConfig, mergeConfig } from 'vite'
import sharedConfig from '../vite.config';

export default defineConfig(mergeConfig(sharedConfig, {
    build: {
        lib: {
            entry: './client-entry.js',
            formats: ['es'],
            fileName: () => 'client-entry.js'
        },
        outDir: '../dist/client'
    },
}))
```

it is just like the server, except format is `es`, because client run in the browser environment. the bundle output will be in `dist/client/client-entry.js`

### how server reference client in production

when we run `node dist/server-entry.js`, the server listen at 3000 port.

```ts
import express from 'express';
import path from 'path';
import server from './server';

const app = express();
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use(server);
app.listen(3000);
```

access `http://localhost:3000/client/client-entry.js` will map to `dist/client/client-entry.js` which is the client bundle output.

```ts
import bodyParser from 'body-parser';
import express from 'express';

const server = express.Router();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', async (req, resp) => {
    resp.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Server is a destiny</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="HTML5 Example Page">
</head>
<body>
  <header>
    <h1>HTML5 Example Page</h1>
  </header>
  <main></main>
  <script type="module" src="/client/client-entry.js"></script>
</body>
</html>
    `)
})

export default server;
```

server rendered html reference `/client/client-entry.js` which is `http://localhost:3000/client/client-entry.js`
We can see SSR is not very difficult, it is just two javascript library. One in commonjs format, runs in node.js. One in es format, runs in browser.
We just need to define 2 vite.config.ts to build this two libraries.

### development server

Unlike production build, we do not want to have 2 vite.config.ts, and run two `vite dev` one for client, one for server.
How to use 1 vite.config.ts to serve both client and server? We need to allow multiple entry point for vite.

* `http://localhost:3000/` we want vite to transform server.ts
* `http://localhost:3000/client/client-entry.js` we want vite to transform client-entry.js

It is very difficult to configure vite for complex behavior with just `vite.config.ts` data. So vite export api to let us control the dev server behavior ourself. It is also easier to debug what went wrong this way, compared to big configuration file. Here is the code we write to control vite as dev server:

```js
import express from 'express';
import { createServer as createViteServer } from 'vite';

async function main() {
    const app = express()
    // auto reload in dev mode
    const vite = await createViteServer({
        server: {
            middlewareMode: 'ssr',
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100
            }
        }
    });
    app.use(vite.middlewares);
    app.all('/(.*)', async (req, resp) => {
        req.url = req.originalUrl;
        console.log(req.method, req.url);
        const { default: handle } = await vite.ssrLoadModule('./server/server.ts');
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
    app.listen(3000, () => {
        console.log('http://localhost:3000')
    });
}

main();
```

`app.use(vite.middlewares);` will take care of everything that actually exists in disk, such as `/client/client-entry.js` actually exists in the filesystem, vite.middlewares can pick it up. In production mode, we use `app.use('/client', express.static(path.join(__dirname, 'client')));` to serve static file instead.

For `http://localhost:3000/` it is rendered by server, we use `await vite.ssrLoadModule('./server/server.ts')` to transform the code and run it. Because the ssrLoadModule invoked per request, and `server.watch` is configured

```ts
 const vite = await createViteServer({
    server: {
        middlewareMode: 'ssr',
        watch: {
            // During tests we edit the files too fast and sometimes chokidar
            // misses change events, so enforce polling for consistency
            usePolling: true,
            interval: 100
        }
    }
});
```

if we changed the server code, we can see the effect just by refreshing browser to send another request to dev server. `vite.ssrFixStacktrace(e)` will fix the exception stack trace, to report the correct original line number, instead of the line number in transformed file. vite.middlewares will check the html rendered by server, and transform the ts/js referneced by html.

### missing index.html

in this configuration, client entry is a js file instead of index.html, we lose the ability to inject html dependencies (such as import css in js to add stylesheet `<link>`). If we reference css from client-entry.js, the css will be placed in dist/client/style.css as a separate file.

