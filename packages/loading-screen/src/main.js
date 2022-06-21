import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from '@/App.vue';

import EndlessKey from '@/views/EndlessKey.vue';
import Loading from '@/views/Loading.vue';
import Welcome from '@/views/Welcome.vue';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { path: '/', redirect: '/loading/default' },
  { path: '/loading/:state', component: Loading },
  { path: '/welcome', component: Welcome },
  { path: '/endless-key', component: EndlessKey },
  {
    path: '/endless-key-required',
    component: EndlessKey,
    props: { required: true },
  },
];

const router = new VueRouter({
  routes,
});

window.app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
