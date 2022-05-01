/// <reference types="vite/client" />

export const pages = import.meta.glob('./pages/**/*.ts')

export async function render(url: string) {
    // let initialState: { greeting: string };

    // if (import.meta.env.SSR) {
    //     // in node.js
    //     const fs = await import('fs');
    //     // simulate reading data from backend
    //     fs.writeFileSync('/tmp/initialState.json', JSON.stringify({
    //         greeting: 'hello world'
    //     }))
    //     initialState = JSON.parse(fs.readFileSync('/tmp/initialState.json', 'utf-8'));
    // } else {
    //     // in browser
    //     const node = document.getElementById('initialState') as HTMLTemplateElement;
    //     initialState = JSON.parse(node.content.textContent);
    //     // simulate slow client side rendering causing FOUC problem
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    // }
    const loadPage = pages[`./pages${url}.ts`];
    if (!loadPage) {
        return undefined;
    }
    const moduleId = 'client/page1.ts';
    const { default: page } = await loadPage();
    const renderResult = page();
    if (!renderResult) {
        return undefined;
    }
    return {
        modules: ['client/page1.ts'],
        ...renderResult
    }
}
