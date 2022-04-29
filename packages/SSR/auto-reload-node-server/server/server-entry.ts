import express from 'express';
import path from 'path';
import server from './server';

const app = express();
app.use(server);
app.use('/client', express.static(path.join(__dirname, 'client')));
app.listen(3000);