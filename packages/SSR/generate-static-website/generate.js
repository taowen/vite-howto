const express = require('express');
const { createServer: createViteServer } = require('vite');
const fs = require('fs');
const path = require('path');

async function main() {
    const vite = await createViteServer();
    const { generate } = await vite.ssrLoadModule('./server/generate.ts');
    const indexHtml = fs.readFileSync(
        path.join(__dirname, 'dist', 'client', 'index.html'), 'utf-8');
    const manifest = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'dist', 'client', 'ssr-manifest.json'), 'utf-8'))
    const rendered = await generate({
        url: '/page1',
        indexHtml,
        manifest
    });
    console.log(rendered);
    await vite.close();
}

main();