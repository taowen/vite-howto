import { store } from 'remote-package-shared-store';

export default function(target: HTMLElement) {
    target.innerHTML = '<button>-</button>'
    target.querySelector('button')!.addEventListener('click', () => {
        store.counter -= 1;
    });
}