# How to auto reload node.js server

## Code Structure & Motivation

It is a node.js application, using express to listen at http://localhost:3000

* server/server-entry.ts is the entry point, which listens the http port
* server/server.ts is the main logic

## DX Problems

dev server should auto reload the node.js server when we have changed the source. nodemon can monitor soure code change and restart node process, but it takes time to restart. It would be nice to make the change without process restart.

## UX Problems

`vite build server` should package every server-entry.ts dependency (except node itself), so we do not need to `npm install` again when deploy.

## Solution Walkthrough

### build node.js application to a bundle

server/vite.config.ts

```ts
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        ssr: './server-entry.ts',
        outDir: '../dist'
    },
})
```

will bundle the `server/server-entry.ts` to `dist/server-entry.js` with everything it referenced (except node.js standard library). It is in commonjs format, ready to be executed in node.js environment. `build.ssr` is provided by vite to build node.js server.

### development server

During development, `http://localhost:3000/` we want vite to transform server.ts on the fly, so we can skip compilation process after making changes

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

We use `await vite.ssrLoadModule('./server/server.ts')` to transform the code and run it. Because the ssrLoadModule invoked per request, and `server.watch` is configured

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

If we changed the server code, we can see the effect just by refreshing browser to send another request to dev server. `vite.ssrFixStacktrace(e)` will fix the exception stack trace, to report the correct original line number, instead of the line number in transformed file. 