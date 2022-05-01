import path from 'path';
import { pages, render } from '../client/render';
import fs from 'fs';

export async function generateAllPages(options: { outDir: string, indexHtml: string, manifest: any }) {
    for (const key of Object.keys(pages)) {
        const url = key.substring('./pages'.length, key.length - '.ts'.length);
        const rendered = await generate({ url, ...options });
        if (!rendered) {
            throw new Error('url not found: ' + url);
        }
        const file = path.join(options.outDir, url.substring(1) + '.html');
        console.log('generate', file);
        fs.writeFileSync(file, rendered);
    }
}

export async function generate(options: { url: string, indexHtml: string, manifest: any }) {
    let rendered = options.indexHtml;
    const renderResult = await render(options.url);
    if (!renderResult) {
        return undefined;
    }
    const { modules, title, view, initialState } = renderResult;
    rendered = rendered.replace('<!--preload-links-->',
        `<title>${title}</title>` + renderPreloadLinks(modules, options.manifest))
    rendered = rendered.replace('<!--app-html-->', `
        ${view}`);
    rendered = rendered.replace('<!--initial-state-->', `
        <template id="initialState">${JSON.stringify(initialState)}</template>`);
    return rendered;
}

function renderPreloadLinks(modules, manifest) {
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