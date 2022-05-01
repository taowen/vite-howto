import {importShared} from './__federation_fn_import.js'
const {store} = await importShared('remote-package-shared-store')

function minusButton(target) {
  target.innerHTML = "<button>-</button>";
  target.querySelector("button").addEventListener("click", () => {
    store.counter -= 1;
  });
}

export { minusButton as default };
