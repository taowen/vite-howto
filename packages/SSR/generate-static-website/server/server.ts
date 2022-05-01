import express from 'express';
import { getWebsiteConfig } from '../client/getWebsiteConfig';
import { generate } from './generate';

export const config = { indexHtml: '', manifest: {} }

const server = express.Router();

server.get('/website-config.js', async (req, resp) => {
    resp.set('Content-Type', 'application/javascript');
    resp.write(`export default ${JSON.stringify(await getWebsiteConfig())}`);
    resp.end();
})

server.get('/(.*)', async (req, resp) => {
    let rendered = await generate({
        url: req.url,
        ...config
    });
    if (!rendered) {
        resp.status(404).end();
        return;
    }
    resp.send(rendered);
})

export default server;