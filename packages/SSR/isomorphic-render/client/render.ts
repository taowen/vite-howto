/// <reference types="vite/client" />

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
    return {
        view: `<div>${initialState.greeting}</div>`,
        initialState
    }
}
