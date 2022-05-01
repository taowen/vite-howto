export async function render() {
    document.querySelector('main')!.innerHTML = 'hello world';
    const { default: plusButton } = await import('@publisher/plusButton')
    plusButton(document.getElementById('slot1')!);
    const { default: minusButton } = await import('@publisher/minusButton');
    minusButton(document.getElementById('slot2')!);
}

render();