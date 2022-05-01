import express from 'express';
import { generate, config } from './generate';

export { config }
const server = express.Router();

server.get('/(.*)', async (req, resp) => {
    let rendered = await generate(req.url);
    if (!rendered) {
        resp.status(404).end();
        return;
    }
    resp.send(rendered);
})

export default server;