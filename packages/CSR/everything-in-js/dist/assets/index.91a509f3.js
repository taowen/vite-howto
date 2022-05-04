const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var index = "Index Page";
var __glob_7_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index
}, Symbol.toStringTag, { value: "Module" }));
var about = "About Page";
var __glob_7_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": about
}, Symbol.toStringTag, { value: "Module" }));
var demo = "";
const blue = "_blue_15qkp_2";
var example_module = {
  blue
};
const hello = "world";
var demoJson = {
  hello
};
var demoJsonUrl = "/assets/demo.9d04e1f3.json";
var demoJsonRaw = '{\n    "hello": "world"\n}';
var demoDynamicSvg = "/assets/demo-dynamic.d3480e7a.svg";
const img = document.createElement("img");
img.setAttribute("src", demoDynamicSvg);
img.setAttribute("width", "300");
document.body.appendChild(img);
var initWasm$1 = async (opts = {}, url) => {
  let result;
  if (url.startsWith("data:")) {
    const binaryString = atob(url.replace(/^data:.*?base64,/, ""));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    result = await WebAssembly.instantiate(bytes, opts);
  } else {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type") || "";
    if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
      result = await WebAssembly.instantiateStreaming(response, opts);
    } else {
      const buffer = await response.arrayBuffer();
      result = await WebAssembly.instantiate(buffer, opts);
    }
  }
  return result.instance.exports;
};
var initWasm = (opts) => initWasm$1(opts, "/assets/demo.47f9337a.wasm");
const pages = { "./pages/index.tsx": __glob_7_0, "./pages/home/about.tsx": __glob_7_1 };
document.querySelector("main").innerHTML = `
        <h1>hello</h1>
        <div class="${blue}">this is blue</div>
        <div>${demoJsonUrl} ${JSON.stringify(demoJson)}</div>
        <pre>${demoJsonRaw}</pre>
        <div>${JSON.stringify(pages)}</div>
        `;
async function loadWasm() {
  const { add } = await initWasm();
  console.log("1+1", add(1, 1));
}
loadWasm();
