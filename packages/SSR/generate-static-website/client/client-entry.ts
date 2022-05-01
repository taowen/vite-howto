import { render } from './render';

async function hydrate({ url, main }: { url: string, main: HTMLElement }) {
    const renderResult = await render(url);
    if (!renderResult) {
        throw new Error('failed to render: ' + url);
    }
    const { view, hydrate } = renderResult;
    if (main.innerHTML.trim() !== view.trim()) {
        console.warn('found server result inconsistent with client result during hydration');
        main.innerHTML = view;
    }
    hydrate();
}

hydrate({
    url: window.location.pathname, 
    main: document.querySelector('main')
});