import express from 'express';
import { generate } from './generate';

export const config = { indexHtml: '', manifest: {} }

const server = express.Router();

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