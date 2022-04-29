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
  <main></main>
  <script type="module" src="./client/client-entry.js"></script>
</body>
</html>
    `)
})

export default server;