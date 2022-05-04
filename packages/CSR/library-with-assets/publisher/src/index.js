import initWasm from './demo.wasm'
import { blue, red } from './demo.module.css'

export async function render() {
    const { add } = await initWasm();
    console.log('1+1', add(1, 1));
    return `<div class="${blue}">hello</div><div class="${red}">world</div>`;
}