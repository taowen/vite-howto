export function loadBackInitialState(): any {
    // in browser
    const node = document.getElementById('initialState') as HTMLTemplateElement;
    return JSON.parse(node.content.textContent);
}