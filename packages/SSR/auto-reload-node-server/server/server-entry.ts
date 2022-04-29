/// <reference types="vite/client" />
import bodyParser from 'body-parser';
import express from 'express';

const server = express.Router();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', async (req, resp) => {
    resp.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Server is a destiny</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="HTML5 Example Page">
</head>
<body>
  <header>
    <h1>HTML5 Example Page</h1>
  </header>
</body>
</html>
    `)
})

if (import.meta.env.PROD) {
  const app = express();
  app.use(server);
  app.listen(3000);
}

export default server;