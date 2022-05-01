import {importShared} from './__federation_fn_import.js'
const {reactive} = await importShared('@vue/reactivity')

const store = reactive({
  counter: 0
});

export { store };
