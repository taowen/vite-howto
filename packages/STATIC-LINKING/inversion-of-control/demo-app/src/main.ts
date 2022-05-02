import { createApp } from 'vue';
import App from './App.vue';
import * as plugin1_inf from '@plugin1';
import * as plugin1_impl from 'demo-plugin1';
import * as plugin2_inf from '@plugin2';
import * as plugin2_impl from 'demo-plugin2';

function checkPlugin<A, B extends A>(a: A, b: B) {
}

// ensure all spi declared by @plugin1 has been implemented by demo-plugin1
checkPlugin(plugin1_inf, plugin1_impl);
// ensure all spi declared by @plugin2 has been implemented by demo-plugin2
checkPlugin(plugin2_inf, plugin2_impl);

export const app = createApp(App);
app.mount('#app')
