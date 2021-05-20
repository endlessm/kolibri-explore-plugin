import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';

import './styles.scss';
import router from './router';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

window.app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
