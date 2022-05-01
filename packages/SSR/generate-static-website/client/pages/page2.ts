import { getWebsiteConfig } from "../getWebsiteConfig";
import { loadBackInitialState } from "../loadBackInitialState";
import './page2.css'

export default async function() {
    let initialState = { content: '' }
    if (import.meta.env.SSR) {
        // simulate reading from database
        initialState.content = 'this is page 2'
    } else {
        initialState = loadBackInitialState();
    }
    const config = await getWebsiteConfig();
    return {
        title: 'Page 2',
        view: `<div>${initialState.content}</div>`,
        initialState,
        hydrate: () => {
            document.body.addEventListener('click', () => {
                alert('clicked page 2\n' + config.someConfigKey);
            })
        }
    }
}