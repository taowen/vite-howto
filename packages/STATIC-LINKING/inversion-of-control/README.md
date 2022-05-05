# How to ensure new code end up in correct package within a mono repository

## Code Structure & Motivation

Motivation is to support Inversion of Control, also known as Dependency Injection.

* demo-motherboard: it defines the abstract interfaces
* demo-plugin1: implement the interface defined in motherboard
* demo-plugin2: implement the interface defined in motherboard
* demo-app: it assembles demo-motherboard, demo-plugin1, demo-plugin2 as a full application.

We can think vite as a static linker, demo-motherboard defines .h file, without specifying the implementation. in demo-app, we statically links the concrete implementation demo-plugin1 and demo-plugin2.

By controlling what dependency each package can have (via package.json), we can ensure new code end up in correct package, because the type they want to reference is only available in certain package. If they want to reference dependency A, they have to write the code in the package has dependency A.

## DX Problems

Abstract interface should be defined without ceremony. It should use TypeScript standard syntax. 

demo-motherboard is not just pure abstract project. If demo-motherboard just define the interfaces, does not know how to wire them up to form a Page or Workflow, the assembling logic will all end up in demo-app. We want demo-motherboard not only defines plugin interface, also defines the relationship between the plugin interfaces.

## UX Problems

Using dynamic linking (Module Federation) will have runtime cost. Enforcing encapsulation via static linking has better runtime performance.

## Solution Walkthrough

The trick is to import from virtual package, such `import xxx from '@plugin1'`. TypeScript and Vite can redirect the virtual package to concrete implementation.

### define abstract interface

demo-motherboard/src/plugin1.abstract.ts

```ts
import { defineComponent } from "vue";

// interface declaration
export const ComponentProvidedByPlugin1 = defineComponent({
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            hello: ''
        }
    },
    methods: {
        onClick() {
        }
    }
})

export function spiExportedByPlugin1ForOtherPlugins(): string {
    throw new Error('abstract');
}
```

It is written a normal TypeScript file, but the function body will not be used, only type signature is used.

### use abstract interface

demo-motherboard/src/SomePage.tsx

```ts
import { ComponentProvidedByPlugin1 } from '@plugin1';
import { ComponentProvidedByPlugin2 } from '@plugin2';
import * as vue from 'vue';

export const SomePage = vue.defineComponent({
    render() {
        return <div>
            ===
            <ComponentProvidedByPlugin1 msg="hello" />
            ===
            <ComponentProvidedByPlugin2 position="blah" />
        </div>
    }
})
```

It is not import from `./plugin1.abstract.ts`, but import from a not existing virtual package `@plugin1`. 

```json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "react",
    "jsxFactory": "vue.h",
    "jsxFragmentFactory": "vue.Fragment",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "composite": true,
    "paths": {
      "@plugin1": ["./src/plugin1.abstract.ts"],
      "@plugin2": ["./src/plugin2.abstract.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "ext/**/*.d.ts"]
}
```

TypeScript knows `@plugin1` is `plugin1.abstract.ts`.

### implement interface

demo-plugin1/src/spiExportedByPlugin1ForOtherPlugins.ts

```ts
import * as plugin1 from '@plugin1';

export const spiExportedByPlugin1ForOtherPlugins: typeof plugin1.spiExportedByPlugin1ForOtherPlugins = () => {
    return 'plugin2 can call plugin1, as long as motherboard declare a spi'
}
```

TypeScript will ensure the interface type and implementation type match.

### static linking

demo-app/vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), {
    // we can inject different implementation, 
    // as long as @plugin1 interface has been implemented
    name: 'inject @plugin1',
    resolveId(id) {
      if (id === '@plugin1') {
        return 'demo-plugin1';
      }
    }
  }, {
    // we can inject different implementation, 
    // as long as @plugin2 interface has been implemented
    name: 'inject @plugin2',
    resolveId(id) {
      if (id === '@plugin2') {
        return 'demo-plugin2';
      }
    }
  }],
  base: '',
})
```

virtual package name `@plugin1` is mapped to a concrete package `demo-plugin1`