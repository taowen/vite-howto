# How to share render code between client/server

## Code Structure & Motivation

* client has entry index.html
* server has entry server/server-entry.ts
* but client/server shares same rendering logic, client/render.ts

The motivation is port existign CSR application to render at server side with minimal effort.

## DX Problems

dev server should auto reload the node.js server when we have changed the source. nodemon can monitor soure code change and restart node process, but it takes time to restart. It would be nice to make the change without process restart.

dev server should auto reload the browser referenced client-entry.js. HMR should work.

## UX Problems

`vite build --ssr server/server-entry.ts --outDir dist` should package every server-entry.ts dependency (except node itself), so we do not need to `npm install` again when deploy.

`vite build --outDir dist/client --ssrManifest` should package every index.html dependency, the javascripts should be collected, merged and minified. In this example, css in js will be translated as `<link>` inside html.

The page will be rendered again in client side (also known as hydration), it should not read from database again, to make sure hydration is fast. So the initial state read at server side need to be transfered to client side to reuse.

Flash of unstyled content (FOUC) is caused by server generated html with content but without corresponding stylesheet. It is not a issue in CSR, because CSR render the content after style inserted into the DOM. In SSR, we want the browser start rendering the content as soon as possible, before the CSR javascript starting to execute. We can not put the stylesheet directly in index.html, as different page execute different javascript will have different css dependency. So to avoid FOUC, we need to know the javascript used to render the page at server side.

## Solution Walkthrough

The solution builds upon previous example, with these additions

* ssrManifest.json to fix FOUC problem
* initial state saved at server side, and transfer to client side

### data loading from backend

Page rendering requires data. We can share the render function between client and server, but the data comes from different source:

* in server, the data comes from some backend database
* in client hydration, we do not want to load the data again, we want to reuse whatever server render used

```ts
/// <reference types="vite/client" />

export async function render() {
    let initialState: { greeting: string };

    if (import.meta.env.SSR) {
        // in node.js
        const fs = await import('fs');
        // simulate reading data from backend
        fs.writeFileSync('/tmp/initialState.json', JSON.stringify({
            greeting: 'hello world'
        }))
        initialState = JSON.parse(fs.readFileSync('/tmp/initialState.json', 'utf-8'));
    } else {
        // in browser
        const node = document.getElementById('initialState') as HTMLTemplateElement;
        initialState = JSON.parse(node.content.textContent);
    }
    return {
        view: `<div>${initialState.greeting}</div>`,
        initialState
    }
}
```

vite support conditional compilation with `import.meta.env.SSR`. The code shared between client and server actually has two copies, one for client and one for server compiled with different `import.meta.env.SSR`.

### initial state transfer

How to transfer the initial state loaded at server to client?
This is out of vite scope, it is SSR framework agnostic.

```ts
server.get('/', async (req, resp) => {
    let rendered = config.indexHtml;
    const { modules, view, initialState } = await render('/');
    rendered = rendered.replace('<!--app-html-->', `
        ${view}`);
    rendered = rendered.replace('<!--initial-state-->', `
        <template id="initialState">${JSON.stringify(initialState)}</template>`);
    resp.send(rendered);
})
```

here we just use JSON.stringify to embed initialState in the server generated html.

### Flash of unstyled content

Flash of unstyled content (FOUC) is caused by server generated html with content but without corresponding stylesheet. It is not a issue in CSR, because CSR render the  content after style inserted into the DOM. In SSR, we want the browser start rendering the content as soon as possible, before the CSR javascript starting to execute.

We can reproduce the issue with following code

```ts
// client/page1.ts
import { page1Text } from './page1.module.css';

export default function(props: { greeting: string }) {
    return `<div class="${page1Text}">${props.greeting}</div>`
}
```

This page depends on its own css file, which will not be bundled to the main css. When the page renders, the style `<link>` will be dynamically inserted to DOM causing FOUC problem. To fix it, we need to include the page own css into the SSR html output.

```ts
server.get('/', async (req, resp) => {
    let rendered = config.indexHtml;
    const { modules, view, initialState } = await render('/');
    rendered = rendered.replace('<!--preload-links-->',
        renderPreloadLinks(modules, config.manifest))
    rendered = rendered.replace('<!--app-html-->', `
        ${view}`);
    rendered = rendered.replace('<!--initial-state-->', `
        <template id="initialState">${JSON.stringify(initialState)}</template>`);
    resp.send(rendered);
})
```

Here the `<!--preload-links-->` is generated from the modules being used to render the html content. In this case, the modules will be `[client/page1.ts]`. It also need a manifest (dist/client/ssr-manifest.json) to know which css file referenced by which:

```json
{
  "vite/modulepreload-polyfill": [],
  "vite/preload-helper": [],
  "client/render.ts": [],
  "client/client-entry.ts": [],
  "index.html": [],
  "client/page1.module.css?used": [
    "/assets/page1.db0834d7.js",
    "/assets/page1.9e27fc78.css"
  ],
  "client/page1.ts": [
    "/assets/page1.db0834d7.js",
    "/assets/page1.9e27fc78.css"
  ]
}
```

This manifest is generated by build command `"vite build --outDir dist/client --ssrManifest"`. It is read into config when server-entry.ts start

```ts
import express from 'express';
import fs from 'fs';
import path from 'path';
import server, { config } from './server';

config.indexHtml = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf-8');
config.manifest = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'client', 'ssr-manifest.json'), 'utf-8'))

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'client', 'assets')));
app.use(server);
app.listen(3000);
```

The manifest will be unavailable when `vite dev`, as FOUC is a user experience problem, we just need to ensure the end-user do not see it in production.