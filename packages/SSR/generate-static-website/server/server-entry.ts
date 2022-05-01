import express from 'express';
import fs from 'fs';
import path from 'path';
import server, { config } from './server';

config.indexHtml = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf-8');
config.manifest = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'client', 'ssr-manifest.json'), 'utf-8'))

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'client', 'assets')));
app.use(server);
app.listen(3000);