# Use big library via CDN

```ts
import monaco from 'monaco-editor';

monaco.editor.create(document.body, {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});
```

monaco-editor size is huge. We do not want to bundle it to our application javascript. We do not want to reference CDN and loader code in application logic as well. How to do that?

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

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js"></script>
<script type="module">
// require is provided by loader.min.js.
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
require(["vs/editor/editor.main"], () => {
    import('./index.ts');
});
</script>
```

Before our application code execute, we need to load the actual library code into `window.monaco`.