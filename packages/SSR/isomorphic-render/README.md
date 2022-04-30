# isomorphic render

Isomorphic is a fancy word to say one code can run both in server (node.js) and client (browser). People want SSR because CSR is slow.
They want to run CSR code without modification in the server and emit html directly. Let's see how vite can help.

## data loading from backend

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

## initial state transfer

How to transfer the initial state loaded at server to client?
This is out of vite scope, it is SSR framework agnostic.

```ts
server.get('/', async (req, resp) => {
    const markerPos = config.indexHtml.indexOf('<!--app-html-->');
    if (markerPos === -1) {
        throw new Error('maker not found, can not inject server generated content');
    }
    resp.write(config.indexHtml.substring(0, markerPos));
    // we can stream output here as well
    const { view, initialState } = await render();
    resp.write(`
    <main>${view}</main>
    <template id="initialState">${JSON.stringify(initialState)}</template>
    `);
    resp.write(config.indexHtml.substring(markerPos));
    resp.end();
})
```

here we just use JSON.stringify to embed initialState in the server generated html.

## Flash of unstyled content

Flash of unstyled content (FOUC) is caused by server generated html with content but without corresponding stylesheet. It is not a issue in CSR, because CSR render the  content after style inserted into the DOM. In SSR, we want the browser start rendering the content as soon as possible, before the CSR javascript starting to execute.

We can reproduce the issue with following code: