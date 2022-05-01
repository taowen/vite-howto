"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var express = require("express");
var fs = require("fs");
var path = require("path");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const pages = { "./pages/page1.ts": () => Promise.resolve().then(function() {
  return page1$1;
}), "./pages/page2.ts": () => Promise.resolve().then(function() {
  return page2$1;
}) };
async function render(url) {
  const loadPage = pages[`./pages${url}.ts`];
  if (!loadPage) {
    return void 0;
  }
  const { default: page } = await loadPage();
  const renderResult = page();
  if (!renderResult) {
    return void 0;
  }
  return __spreadValues({
    modules: ["client/page1.ts"]
  }, renderResult);
}
const config = { indexHtml: "", manifest: {} };
const server = express__default["default"].Router();
server.get("/(.*)", async (req, resp) => {
  let rendered = config.indexHtml;
  const renderResult = await render(req.url);
  if (!renderResult) {
    resp.status(404).end();
    return;
  }
  const { modules, view, initialState } = renderResult;
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
function page1() {
  return {
    title: "Page 1",
    view: "<div>this is page 1</div>",
    hydrate: () => {
      document.body.addEventListener("click", () => {
        alert("clicked page 1");
      });
    }
  };
}
var page1$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": page1
}, Symbol.toStringTag, { value: "Module" }));
function page2() {
  return {
    title: "Page 2",
    view: "<div>this is page 2</div>",
    hydrate: () => {
      document.body.addEventListener("click", () => {
        alert("clicked page 2");
      });
    }
  };
}
var page2$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": page2
}, Symbol.toStringTag, { value: "Module" }));
