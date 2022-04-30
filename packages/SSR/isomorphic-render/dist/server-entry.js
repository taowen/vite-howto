"use strict";
var express = require("express");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
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
var fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
var bodyParser__default = /* @__PURE__ */ _interopDefaultLegacy(bodyParser);
const page1$2 = () => Promise.resolve().then(function() {
  return page1$1;
});
const pages = {
  "client/page1.ts": page1$2
};
async function render(url) {
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
  const moduleId = "client/page1.ts";
  const { default: page } = await pages[moduleId]();
  return {
    modules: ["client/page1.ts"],
    view: `${page(initialState)}`,
    initialState
  };
}
const config = { indexHtml: "", manifest: {} };
const server = express__default["default"].Router();
server.use(bodyParser__default["default"].urlencoded({ extended: false }));
server.use(bodyParser__default["default"].json());
server.get("/", async (req, resp) => {
  let rendered = config.indexHtml;
  const { modules, view, initialState } = await render();
  rendered = rendered.replace("<!--preload-links-->", renderPreloadLinks(modules, config.manifest));
  rendered = rendered.replace("<!--app-html-->", `
        ${view}`);
  rendered = rendered.replace("<!--initial-state-->", `
        <template id="initialState">${JSON.stringify(initialState)}</template>`);
  resp.send(rendered);
});
function renderPreloadLinks(modules, manifest) {
  console.log("preload", modules, manifest);
  let links = "";
  const seen = /* @__PURE__ */ new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = path__default["default"].basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}
function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    return "";
  }
}
config.indexHtml = fs__default["default"].readFileSync(path__default["default"].join(__dirname, "client", "index.html"), "utf-8");
config.manifest = JSON.parse(fs__default["default"].readFileSync(path__default["default"].join(__dirname, "client", "ssr-manifest.json"), "utf-8"));
const app = express__default["default"]();
app.use("/assets", express__default["default"].static(path__default["default"].join(__dirname, "client", "assets")));
app.use(server);
app.listen(3e3);
const page1Text = "_page1Text_1vc12_1";
var page1_module = {
  page1Text
};
function page1(props) {
  return `<div class="${page1Text}">${props.greeting}</div>`;
}
var page1$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": page1
}, Symbol.toStringTag, { value: "Module" }));
