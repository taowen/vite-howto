"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  var n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    Object.keys(e).forEach(function(k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
var bodyParser__default = /* @__PURE__ */ _interopDefaultLegacy(bodyParser);
var fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
async function render() {
  let initialState;
  {
    const fs2 = await Promise.resolve().then(function() {
      return /* @__PURE__ */ _interopNamespace(require("fs"));
    });
    fs2.writeFileSync("/tmp/initialState.json", JSON.stringify({
      greeting: "hello world"
    }));
    initialState = JSON.parse(fs2.readFileSync("/tmp/initialState.json", "utf-8"));
  }
  return {
    view: `<div>${initialState.greeting}</div>`,
    initialState
  };
}
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
  const { view, initialState } = await render();
  resp.write(`
    <main>${view}</main>
    <template id="initialState">${JSON.stringify(initialState)}</template>
    `);
  resp.write(config.indexHtml.substring(markerPos));
  resp.end();
});
config.indexHtml = fs__default["default"].readFileSync(path__default["default"].join(__dirname, "client", "index.html"), "utf-8");
const app = express__default["default"]();
app.use("/assets", express__default["default"].static(path__default["default"].join(__dirname, "client", "assets")));
app.use(server);
app.listen(3e3);
