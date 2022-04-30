import { render } from './render';

async function hydrate(main: HTMLElement) {
    const { view } = await render();
    if (main.innerHTML === view) {
        return;
    }
    console.warn('found server result inconsistent with client result during hydration');
    main.innerHTML = view;
}

hydrate(document.querySelector('main'));