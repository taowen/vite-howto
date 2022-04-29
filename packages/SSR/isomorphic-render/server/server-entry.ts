import express from 'express';
import path from 'path';
import server, { config } from './server';
import fs from 'fs';

config.indexHtml = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf-8');

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'client', 'assets')));
app.use(server);
app.listen(3000);