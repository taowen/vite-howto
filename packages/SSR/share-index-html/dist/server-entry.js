"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
var bodyParser__default = /* @__PURE__ */ _interopDefaultLegacy(bodyParser);
var fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
const config = { indexHtml: "" };
const server = express__default["default"].Router();
server.use(bodyParser__default["default"].urlencoded({ extended: false }));
server.use(bodyParser__default["default"].json());
server.get("/", async (req, resp) => {
  const markerPos = config.indexHtml.indexOf("<!--app-html-->");
  if (markerPos === -1) {
    throw new Error("maker not found, can not inject server generated content");
  }
  resp.write(config.indexHtml.substring(0, markerPos));
  resp.write(`
    <header>
        <h1>HTML5 Example Page</h1>
    </header>
    <main></main>
    `);
  resp.write(config.indexHtml.substring(markerPos));
  resp.end();
});
config.indexHtml = fs__default["default"].readFileSync(path__default["default"].join(__dirname, "client", "index.html"), "utf-8");
const app = express__default["default"]();
app.use("/assets", express__default["default"].static(path__default["default"].join(__dirname, "client", "assets")));
app.use(server);
app.listen(3e3);
