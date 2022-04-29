"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var bodyParser = require("body-parser");
var express = require("express");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var bodyParser__default = /* @__PURE__ */ _interopDefaultLegacy(bodyParser);
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
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
</body>
</html>
    `);
});
{
  const app = express__default["default"]();
  app.use(server);
  app.listen(3e3);
}
exports["default"] = server;
