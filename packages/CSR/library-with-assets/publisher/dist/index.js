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
var initWasm = (opts) => initWasm$1(opts, "data:application/wasm;base64,AGFzbQEAAAABh4CAgAABYAJ/fwF/A4KAgIAAAQAFg4CAgAABABEHkICAgAACBm1lbW9yeQIAA2FkZAAAComAgIAAAQcAIAEgAGoLC7aEgIAAAgBBgIDAAAsIAQAAAAIAAAAAQYiAwAALnAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkYCAgAAEbmFtZQGGgICAAAEAA2FkZAD+gICAAAlwcm9kdWNlcnMCCGxhbmd1YWdlAQRSdXN0BDIwMTgMcHJvY2Vzc2VkLWJ5AwVydXN0Yx0xLjM0LjEgKGZjNTBmMzI4YiAyMDE5LTA0LTI0KQZ3YWxydXMFMC43LjAMd2FzbS1iaW5kZ2VuEjAuMi40NSAoNmZhNmFmMjNiKQ==");
const blue = "_blue_6duqs_1";
const red = "_red_6duqs_5";
var demo_module = {
  blue,
  red
};
async function render() {
  const { add } = await initWasm();
  add(1, 1);
  return `<div class="${blue}">hello</div><div class="${red}">world</div>`;
}
export { render };
