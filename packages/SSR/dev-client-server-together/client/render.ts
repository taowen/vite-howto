import './client.css?inline'

export function render(): any {
    document.querySelector('main').innerHTML = 'hello world';
}