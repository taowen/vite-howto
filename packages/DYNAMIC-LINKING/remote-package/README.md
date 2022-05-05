# How to publish new version without asking application using the library to re-bundle and re-deploy

## Code Structure & Motivation

Publish the package to CDN as a remote package, so another application can dynamic import it at runtime. This allows the remote package maintainer to publish a new version without asking its user to rebundle and redeploy.

In this example

* publisher: it provide dynamic library at http://localhost:3001/assets/remoteEntry.js
* consumer: it is CSR application, references publisher library
* shared-store: it is a plain old javascript library, shared between publisher / consumer

## DX Problem

Remote package should be able to share javascript object between publisher / consumer at runtime, so that

* frameworks such as Vue/React do not need to bundled several times, they can share one global instance
* data store must be global singleton

During development, we might change publisher and consumer at the same time. There should be a way to edit/debug without go through publishing process.

Even if the remote package is dynamically loaded, we still want to statically type check the api compatibility.

## UX Problem

Loading library dynamically takes time, there should be way to insert loading indicator

## Solution Walkthrough

### type safety

consumer/tsconfig.json

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "noEmit": true,
        "types": ["jest"],
        "lib": ["ESNext", "DOM"],
        "baseUrl": ".",
        "paths": {
            "@publisher/*": ["../publisher/src/*"]
        }
    },
    "include": [
        "src/**/*.ts"
    ]
}
```

we are using typescript paths alias to provide type definition of @publisher, so that

```ts
const { default: plusButton } = await import('@publisher/plusButton')
plusButton(document.getElementById('slot1')!);
```

can be compiled with type checking

### more information

refer to https://github.com/originjs/vite-plugin-federation for more information