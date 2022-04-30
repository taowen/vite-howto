import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { render } from '../client/render';

export const config = { indexHtml: '', manifest: {} }
const server = express.Router();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', async (req, resp) => {
    let rendered = config.indexHtml;
    // we can stream output here as well
    const { modules, view, initialState } = await render('/');
    rendered = rendered.replace('<!--preload-links-->',
        renderPreloadLinks(modules, config.manifest))
    rendered = rendered.replace('<!--app-html-->', `
        <main>${view}</main>
        <template id="initialState">${JSON.stringify(initialState)}</template>
        `);
    resp.send(rendered);
})

function renderPreloadLinks(modules, manifest) {
    console.log('preload', modules, manifest);
    let links = ''
    const seen = new Set()
    modules.forEach((id) => {
        const files = manifest[id]
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file)
                    const filename = path.basename(file)
                    if (manifest[filename]) {
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile)
                            seen.add(depFile)
                        }
                    }
                    links += renderPreloadLink(file)
                }
            })
        }
    })
    return links
}

function renderPreloadLink(file) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    } else {
        // TODO
        return ''
    }
}

export default server;