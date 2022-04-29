# Everything in Javascript

Given html is client side rendered via javascript, we can make the html totally blank, and let javascript to control everything.

Unlike html dependencies, javascript reference everything with `import` statement. However, import different file suffix has totally different effect.

```js
import './demo.css';
import { blue } from './example.module.css';
import demoJson from './demo.json';
import demoJsonUrl from './demo.json?url';
import demoJsonRaw from './demo.json?raw';
import './some-js/demo.js';
const pages = import.meta.globEager('./pages/**/*.tsx')
```

You can event import image in sub file `some-js/demo.js`

```js
import demoDynamicSvg from './demo-dynamic.svg';
const img = document.createElement('img');
img.setAttribute('src', demoDynamicSvg);
// img.setAttribute('src', new URL('./demo-dynamic.svg', import.meta.url).href);
img.setAttribute('width', '300');
document.body.appendChild(img);
```

How vite process the import is not a web standard. If we want to use the file in environment not controlled by vite, such as jest unit test, we might have trouble. So https://vitest.dev/ is invented to allow vite to run unit test as well.