"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
var bodyParser__default = /* @__PURE__ */ _interopDefaultLegacy(bodyParser);
const server = express__default["default"].Router();
server.use(bodyParser__default["default"].urlencoded({ extended: false }));
server.use(bodyParser__default["default"].json());
server.get("/", async (req, resp) => {
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
  <script type="module" src="/client/client-entry.js"><\/script>
</body>
</html>
    `);
});
const app = express__default["default"]();
app.use("/client", express__default["default"].static(path__default["default"].join(__dirname, "client")));
app.use(server);
app.listen(3e3);
