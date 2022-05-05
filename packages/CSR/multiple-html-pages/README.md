# How to write a website in multiple html files

## Code Structure & Motivation

Instead of using javascript file to represent a website page, let's just use a normal html file to represent a website page.
Instead of import css from javascript, let's just use `<link>` to reference css from html file.
The motivation is to use use good old web technique to hand write a website.

## DX Problems

Declaring dependencies manually is annonying. Page dependencies should be infered from html source code.

Two pages might have common dependencies, should have preset to deal with these common dependencies. Developer want to set a strategy, and let vite to arrange code into different chunks automatically. 

Multiple html files might have common header / footer. We do want manually keep them in sync. There should be way to extract out the common layout into separate files.

## UX Problems

Assets and javascripts should be bundled if possible. Even split into pages requires some dynamic loading, but separate file should be kept minimal.

One page might have multiple files (stylesheet, js, etc), they should be loaded concurrently if possible.

Click link to another html file will cause the browser to reload whole page, it would be nice to mimic client side rendering behavior to use fetch instead of whole page refresh.

## Solution Walkthrough

### multiple entries

We need to provide the list of html files to vite.config.ts

```ts
import path from 'path'
import { defineConfig } from 'vite'

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about', 'about.html'),
        contactus: path.resolve(__dirname, 'contactus.html'),
      }
    }
  }
})
```

The dist output will keep original file structure (about.html inside about directory):

```
dist
├── about
│   └── about.html
├── assets
│   ├── about.1b39ea8a.css
│   ├── about.a37961d6.js
│   ├── common.dc7b67c0.css
│   ├── contactus.b1e18fb5.js
│   ├── handleLink.52044c3e.js
│   ├── main.2193a552.css
│   └── main.4ae14d3e.js
├── contactus.html
└── index.html
```

We added a `handleLink.js` to do navigation without whole page refresh:

```ts
function handleLink() {
    const links = document.querySelectorAll('a[href^="/"]');
    for (const link of links) {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            window.history.pushState(undefined, '', url);
            replaceHtml(url);
        });
    }
}

async function replaceHtml(url) {
    const resp = await fetch(url)
    const html = await resp.text();
    document.documentElement.innerHTML = html;
    handleLink();
    for (const node of document.querySelectorAll('script')) {
        const script = document.createElement('script');
        for (let i = 0; i < node.attributes.length; i++) {
            script.setAttribute(node.attributes.item(i).name, node.attributes.item(i).value);
        }
        const src = new URL(script.getAttribute('src'), window.location.href);
        src.searchParams.append('t', new Date().getTime());
        script.setAttribute('src', src.toString());
        node.replaceWith(script);
    }
}

if (!window.handleLinkEnabled) {
    window.handleLinkEnabled = true;
    handleLink();
    window.addEventListener('popstate', () => {
        replaceHtml(window.location.href);
    })
}
```

What it does is like es6 dynamic `import()` to load the next page content/behavior with fetch, then apply it to DOM. Using a html file to represent a page, and dynamically download it, is much more natural than using javascript to represent a page.

### server side include

```ts
import path from 'path'
import { defineConfig } from 'vite'
import fs from 'fs';

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about', 'about.html'),
        contactus: path.resolve(__dirname, 'contactus.html'),
      }
    }
  },
  plugins: [{
    name: 'server side include',
    transformIndexHtml(html, ctx) {
      console.log('transform', ctx.filename);
      html = html.replace('<body>', `<body>${fs.readFileSync('layout/header.partial.html', 'utf-8')}`);
      return html;
    }
  }]
})
```

`vite dev` and `vite build` will both call `transformIndexHtml` to allow us to do server side include.