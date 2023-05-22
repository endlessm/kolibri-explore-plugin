import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import EkComponents from 'ek-components';
import App from '@/App.vue';

import PackSelection from '@/views/PackSelection.vue';
import PackReady from '@/views/PackReady.vue';
import UsbDriveConnection from '@/views/UsbDriveConnection.vue';
import PermissionsExplanation from '@/views/PermissionsExplanation.vue';
import PermissionsCancelled from '@/views/PermissionsCancelled.vue';
import PermissionsWrongFolder from '@/views/PermissionsWrongFolder.vue';
import Loading from '@/views/Loading.vue';
import LoadingInitial from '@/views/LoadingInitial.vue';
import LoadingError from '@/views/LoadingError.vue';
import LoadingRetry from '@/views/LoadingRetry.vue';
import Welcome from '@/views/Welcome.vue';
import store from "@/store";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(EkComponents);

Vue.config.productionTip = false;

const routes = [
  { path: '/', redirect: '/loading/initial' },
  { path: '/loading/default', component: Loading },
  { path: '/loading/initial', component: LoadingInitial },
  { path: '/loading/error', component: LoadingError },
  { path: '/loading/retry', component: LoadingRetry },
  { path: '/welcome', component: Welcome },
  { path: '/select-pack', component: PackSelection },
  { path: '/pack-ready', component: PackReady },
  { path: '/endless-key', component: UsbDriveConnection },
  {
    path: '/endless-key-required',
    component: UsbDriveConnection,
    props: { required: true },
  },
  { path: '/grant-permissions', component: PermissionsExplanation },
  { path: '/permissions-cancelled', component: PermissionsCancelled },
  { path: '/permissions-wrong-folder', component: PermissionsWrongFolder },
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
