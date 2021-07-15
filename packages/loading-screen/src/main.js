import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from '@/App.vue';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

// TODO: expose functions to use during kolibri-electron loading
//  * show_retry()
//  * show_error()
//  * firstLaunch()

window.app = new Vue({
  render: (h) => h(App),
}).$mount('#app');
