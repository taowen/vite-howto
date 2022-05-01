const vite = require('vite');
const fs = require('fs');
const path = require('path');

async function main() {
    const { generateAllPages } = await loadModule('./server/generate.ts');
    const indexHtml = fs.readFileSync(
        path.join(__dirname, 'dist', 'index.html'), 'utf-8');
    const manifest = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'dist', 'ssr-manifest.json'), 'utf-8'))
    await generateAllPages({
        outDir: path.join(__dirname, 'dist', 'website'),
        indexHtml,
        manifest
    });
}

async function loadModule(path) {
    const server = await vite.createServer();
    try {
        return await server.ssrLoadModule(path);
    } finally {
        await server.close();
    }
}

main();