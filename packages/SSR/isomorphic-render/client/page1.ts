import { page1Text } from './page1.module.css';

export default function(props: { greeting: string }) {
    return `<div class="${page1Text}">${props.greeting}</div>`
}