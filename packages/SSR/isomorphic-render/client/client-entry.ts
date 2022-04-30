import { render } from './render';

async function hydrate({ url, main }: { url: string, main: HTMLElement }) {
    const { view } = await render(url);
    if (main.innerHTML === view) {
        return;
    }
    console.warn('found server result inconsistent with client result during hydration');
    main.innerHTML = view;
}

hydrate({
    url: '/', 
    main: document.querySelector('main')
});