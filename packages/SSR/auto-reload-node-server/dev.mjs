import express from 'express';
import { createServer as createViteServer } from 'vite';

async function main() {
    const app = express()
    // auto reload in dev mode
    const vite = await createViteServer({
        server: {
            middlewareMode: 'ssr',
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100
            }
        }
    });
    app.use(vite.middlewares);
    app.all('/(.*)', async (req, resp) => {
        req.url = req.originalUrl;
        console.log(req.method, req.url);
        const { default: handle } = await vite.ssrLoadModule('./server/server-entry.ts');
        handle(req, resp, (e) => {
            if (e) {
                vite.ssrFixStacktrace(e)
                console.error(e.stack)
                resp.status(500).end(e.stack);
            } else {
                resp.status(404).end();
            }
        });
    })
    app.listen(3000, () => {
        console.log('http://localhost:3000')
    });
}

main();