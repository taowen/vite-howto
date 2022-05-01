const express = require('express');
const { createServer: createViteServer } = require('vite');
const fs = require('fs');
const path = require('path');

async function main() {
    const vite = await createViteServer();
    const { generate, config } = await vite.ssrLoadModule('./server/generate.ts');
    config.indexHtml = fs.readFileSync(
        path.join(__dirname, 'dist', 'client', 'index.html'), 'utf-8');
    config.manifest = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'dist', 'client', 'ssr-manifest.json'), 'utf-8'))
    const rendered = generate('/page1');
    console.log(rendered);
}

main();