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