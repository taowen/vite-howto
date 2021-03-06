import { getWebsiteConfig } from "../getWebsiteConfig";
import { loadBackInitialState } from "../loadBackInitialState"
import './page1.css';

export default async function() {
    let initialState = { content: '' }
    if (import.meta.env.SSR) {
        // simulate reading from database
        initialState.content = 'this is page 1'
    } else {
        initialState = loadBackInitialState();
    }
    const config = await getWebsiteConfig();
    return {
        title: 'Page 1',
        view: `<div>${initialState.content}</div><div>${config.someConfigKey}</div>`,
        initialState,
        hydrate: () => {
            document.body.addEventListener('click', () => {
                alert('clicked page 1');
            })
        }
    }
}