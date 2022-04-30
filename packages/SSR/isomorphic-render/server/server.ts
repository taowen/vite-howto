import bodyParser from 'body-parser';
import express from 'express';
import { render } from '../client/render';

export const config = { indexHtml: '' }
const server = express.Router();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', async (req, resp) => {
    const markerPos = config.indexHtml.indexOf('<!--app-html-->');
    if (markerPos === -1) {
        throw new Error('maker not found, can not inject server generated content');
    }
    resp.write(config.indexHtml.substring(0, markerPos));
    // we can stream output here as well
    const { view, initialState } = await render();
    resp.write(`
    <main>${view}</main>
    <template id="initialState">${JSON.stringify(initialState)}</template>
    `);
    resp.write(config.indexHtml.substring(markerPos));
    resp.end();
})

export default server;