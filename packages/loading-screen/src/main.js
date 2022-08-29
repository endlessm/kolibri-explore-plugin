import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import eosComponents from 'eos-components';
import App from '@/App.vue';

import ContentSourceSelection from '@/views/ContentSourceSelection.vue';
import UsbDriveConnection from '@/views/UsbDriveConnection.vue';
import PermissionsExplanation from '@/views/PermissionsExplanation.vue';
import PermissionsCancelled from '@/views/PermissionsCancelled.vue';
import PermissionsWrongFolder from '@/views/PermissionsWrongFolder.vue';
import Loading from '@/views/Loading.vue';
import LoadingError from '@/views/LoadingError.vue';
import LoadingRetry from '@/views/LoadingRetry.vue';
import Welcome from '@/views/Welcome.vue';
import { store } from "@/store.js";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(eosComponents);

Vue.config.productionTip = false;

const routes = [
  { path: '/', redirect: '/loading/default' },
  { path: '/loading/default', component: Loading },
  { path: '/loading/error', component: LoadingError },
  { path: '/loading/retry', component: LoadingRetry },
  { path: '/welcome', component: Welcome },
  { path: '/select-source', component: ContentSourceSelection },
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

window.app = new Vue({
  router,
  data: store.state,
  render: (h) => h(App),
}).$mount('#app');
