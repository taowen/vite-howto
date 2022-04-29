# Reduce homepage size

Single page application (SPA) has bad reputation of bloated bundle size.
After everything-in-js, we can download the minimal required dependency for the first homepage. The question is, how to decide what is in the minimal set, what is not?

Luckily, we do not need to manually maintain the dependencies. We only need to use 

```js
window.$Page1 = () => import('./pages/page1.js');
window.$Page2 = () => import('./pages/page2.js');
```

instead of 

```js
import Page1 from './pages/page1.js';
import Page2 from './pages/page2.js';
```

the dependencies of page1 and page2 will be excluded from the homepage. When we render the page, we just need await

```js
window.$render = async (pageProvider) => {
    const { default: render } = await pageProvider();
    render();
}
```

`$render($Page1)` will download the code required if not downloaded before, and evaluate the javascript return the module. we use the render function exported default to render.

Vite takes this pattern a step further to allow scan the filesystem:

```js
window.$AllPages = import.meta.glob('./pages/**/*.js');
```

It will contain

```js
{
    './pages/page2.js': { default: f },
    './pages/page1.js': { default: f },
}
```
