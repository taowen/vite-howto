import { store } from 'remote-package-shared-store';
import { effect } from '@vue/reactivity';

export async function render() {
    effect(() => {
        document.querySelector('main')!.innerHTML = `counter value: ${store.counter}`;
    });
    const { default: plusButton } = await import('@publisher/plusButton')
    plusButton(document.getElementById('slot1')!);
    const { default: minusButton } = await import('@publisher/minusButton');
    minusButton(document.getElementById('slot2')!);
}

render();