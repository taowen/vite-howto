# How to generate a static website

## Code Structure & Motivation

Majority of code is in client directory, it is a typical CSR application. To generate a website statically, we need to statically know how many pages to generate.
Using dynamic `import()` embeded in javascript file will make it hard iterate all pages, so a file based routing is used:

* client/pages/page1.ts is page1, will generate page1.html
* client/pages/page2.ts is page2, will generate page2.html

It is imported as `import.meta.glob('./pages/**/*.ts')`

Server code has two entries:

* server/server.ts: used in development to debug the application lively with browser
* server/generate.ts: used in production as a cli to generate pages to html files

## DX Problems

dev server should auto reload the node.js server when we have changed the source. nodemon can monitor soure code change and restart node process, but it takes time to restart. It would be nice to make the change without process restart.

dev server should auto reload the browser referenced client-entry.js. HMR should work.

## UX Problems

generate.ts generate the html files should package every index.html dependency, the javascripts should be collected, merged and minified. In this example, css in js will be translated as `<link>` inside html.

The page will be rendered again in client side (also known as hydration), it should not read from database again, to make sure hydration is fast. So the initial state read at server side need to be transfered to client side to reuse.

Every page might have different initial state. We can not make initial state a site wide config, and load the initial state once per website, as it will be too large. We do not want every page to embed its own initial state in its html, because there might be overlap between pages. To minimize the file size of each generated html file, we need a site wide configuration as a complement to per page initial state.

Flash of unstyled content (FOUC) is caused by statically generated html with content but without corresponding stylesheet. It is not a issue in CSR, because CSR render the content after style inserted into the DOM. In SSG, we want the browser start rendering the statical html as soon as possible, before the CSR javascript starting to execute. We can not put the stylesheet directly in index.html, as different page execute different javascript will have different css dependency. So to avoid FOUC, we need to know the javascript used to render the page when static generate.

## Solution Walkthrough

### file based routing

```ts
// client/render.ts
export const pages = import.meta.glob('./pages/**/*.ts')

export async function render(url: string) {
    const loadPage = pages[`./pages${url}.ts`];
    if (!loadPage) {
        return undefined;
    }
    const { default: page } = await loadPage();
    const renderResult = await page();
    if (!renderResult) {
        return undefined;
    }
    return {
        modules: [`client/pages${url}.ts`],
        ...renderResult
    }
}
```

vite support `import.meta.glob` to read from filesystem. `export const pages` for server/generate.ts

### generate all pages

```ts
// sever/generate.ts
import fs from 'fs';
import path from 'path';
import { getWebsiteConfig } from '../client/getWebsiteConfig';
import { pages, render } from '../client/render';

export async function generateAllPages(options: { outDir: string, indexHtml: string, manifest: any }) {
    for (const key of Object.keys(pages)) {
        const url = key.substring('./pages'.length, key.length - '.ts'.length);
        const rendered = await generate({ url, ...options });
        if (!rendered) {
            throw new Error('url not found: ' + url);
        }
        const file = path.join(options.outDir, url.substring(1) + '.html');
        console.log('generate', file);
        fs.writeFileSync(file, rendered);
    }
    fs.writeFileSync(path.join(options.outDir, 'website-config.js'),
        `export default ${JSON.stringify(await getWebsiteConfig())}`)
}
```

we reuse file based routing to generate the page to html one by one.

### build index.html to collect dependencies

generate.ts is implemented by us, we do not want to implement `vite build` again, which scans index.html and collect its dependencies ourself.
we reuse `vite build` and generate.ts build upon its build result:

```
"build:client": "vite build --ssrManifest && mv dist/website/index.html dist/index.html && mv dist/website/ssr-manifest.json dist/ssr-manifest.json",
"build:generate": "node generate.js",
"build": "pnpm build:client && pnpm build:generate",
```

the build result read by generate.js

```js
// generate.js
async function main() {
    const { generateAllPages } = await loadModule('./server/generate.ts');
    const indexHtml = fs.readFileSync(
        path.join(__dirname, 'dist', 'index.html'), 'utf-8');
    const manifest = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'dist', 'ssr-manifest.json'), 'utf-8'))
    await generateAllPages({
        outDir: path.join(__dirname, 'dist', 'website'),
        indexHtml,
        manifest
    });
}
```

loadModule use vite to compile ts to js on the fly, so we can use `node generate.js` without compile generate.ts first. Here vite is used like ts-node to execute command line.

### initial state and website config

take page1.ts as an example

```ts
import { getWebsiteConfig } from "../getWebsiteConfig";
import { loadBackInitialState } from "../loadBackInitialState"
import './page1.css';

export default async function() {
    let initialState = { content: '' }
    if (import.meta.env.SSR) {
        // simulate reading from database
        initialState.content = 'this is page 1'
    } else {
        initialState = loadBackInitialState();
    }
    const config = await getWebsiteConfig();
    return {
        title: 'Page 1',
        view: `<div>${initialState.content}</div><div>${config.someConfigKey}</div>`,
        initialState,
        hydrate: () => {
            document.body.addEventListener('click', () => {
                alert('clicked page 1');
            })
        }
    }
}
```

the page is rendered from data provided by initial state and website config. The page1.ts render function will be executed twice, once by generate at the server, and then be executed at the browser again. When execute by generate, `import.meta.env.SSR` will be true, the data will read from database, if false it will use `loadBackInitialState` to read from browser DOM.

```ts
export function loadBackInitialState(): any {
    // in browser
    const node = document.getElementById('initialState') as HTMLTemplateElement;
    return JSON.parse(node.content.textContent!);
}
```

initial state is embeded in the page static html. `getWebsiteConfig` also work in the same way:

```ts
let cache: any;

export async function getWebsiteConfig() {
    if (!cache) {
        cache = await loadWebsiteConfig();
    }
    return cache;
}

async function loadWebsiteConfig() {
    if (import.meta.env.SSR) {
        // simulate reading from database
        return { someConfigKey: '=== blah ===' };
    } else {
        // generate.ts will generate website-config.js
        // server.ts will provide route for /website-config.js
        const loc = '/website-config.js' as any;
        return (await import(/* @vite-ignore */loc)).default;
    }
}
```

website config is shared among all pages, so we need a extra `/website-config.js` to transfer the state to client. during development, `/website-config.js` is provided by dev server:

```ts
server.get('/website-config.js', async (req, resp) => {
    resp.set('Content-Type', 'application/javascript');
    resp.write(`export default ${JSON.stringify(await getWebsiteConfig())}`);
    resp.end();
})
```

during website generation, we genate the website-config.js file as part of `generateAllPages`