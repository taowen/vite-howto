/// <reference types="vite/client" />

const page1 = () => import('./page1');

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
    const { default: page } = await page1()
    return {
        view: `${page(initialState)}`,
        initialState
    }
}
