import express from 'express';
import path from 'path';
import server from './server';

const app = express();
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use(server);
app.listen(3000);