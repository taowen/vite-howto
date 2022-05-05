# How to consume big library via CDN

## Code Structure & Motivation

monaco-editor is npm installed, and the api call should be checked by typescript

```ts
import monaco from 'monaco-editor';

monaco.editor.create(document.body, {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});
```

monaco-editor size is huge. We do not want to bundle it to our application javascript. We do not want to reference CDN and loader code in application logic as well. How to do that?

## DX Problem

We want to use monaco editor from CDN, but we do not want to lose the typescript type check

The monaco editor version should match the version npm installed

The monaco editor should be served from CDN both in development and production, so the mis-behavior can be identified earlier

## UX Problem

Need to have control of CDN dynamic library loading process, so that loading indicator can be inserted.

## Solution Walkthrough

### change static linking to dynamic linking

```ts
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [{
        name: 'provide monaco',
        load(id) {
            if (id === '@monaco') {
                return 'export default window.monaco'
            }
        }
    }],
    resolve: {
        alias: {
            'monaco-editor': '@monaco'
        }
    }
})
```

We provide a fake "monaco-editor", so `import monaco from 'monaco-editor'` will get `window.monaco` instead.

### use AMD loader

AMD stands for Asynchronous module definition

```html
<script type="module">
    window.onMonacoLoaded = async () => {
        const { renderApp } = await import('./index.ts');
        renderApp();
    };
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js"></script>
<script type="module">
// require is provided by loader.min.js.
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
require(["vs/editor/editor.main"], window.onMonacoLoaded);
</script>
```

Before our application code execute, we need to load the actual library code into `window.monaco`.

### match package.json version

```ts
import { defineConfig } from 'vite'
import pkg from './package.json';

export default defineConfig({
    plugins: [{
        name: 'provide monaco',
        load(id) {
            if (id === '@monaco') {
                return 'export default window.monaco'
            }
        },
        transformIndexHtml(html) {
            html = html.replace('</body>', `
            <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${pkg.dependencies['monaco-editor']}/min/vs/loader.min.js"></script>
            <script type="module">
            // require is provided by loader.min.js.
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${pkg.dependencies['monaco-editor']}/min/vs' }});
            require(["vs/editor/editor.main"], window.onMonacoLoaded);
            </script>
            </body>`);
            return html;
        }
    }],
    resolve: {
        alias: {
            'monaco-editor': '@monaco'
        }
    }
})
```

we can read the monaco-editor version from package.json, to ensure the version used in type checking matches the actual runtime version.