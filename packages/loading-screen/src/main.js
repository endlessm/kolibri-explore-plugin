import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import EkComponents from 'ek-components';
import App from '@/App.vue';

import Loading from '@/views/Loading.vue';
import LoadingInitial from '@/views/LoadingInitial.vue';
import LoadingError from '@/views/LoadingError.vue';
import LoadingRetry from '@/views/LoadingRetry.vue';
import store from "@/store";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(EkComponents);

Vue.config.productionTip = false;

// FIXME temporary workaround while migrating views using ek-components to the plugin
Vue.prototype.$tr = function $tr(messageId) {
  return this.$options.$trs[messageId];
};

const routes = [
  { path: '/', redirect: '/loading/initial' },
  { path: '/loading/default', component: Loading },
  { path: '/loading/initial', component: LoadingInitial },
  { path: '/loading/error', component: LoadingError },
  { path: '/loading/retry', component: LoadingRetry },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // This only helps with debugging:
  document.title = to.path;
  next();
})

window.app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
