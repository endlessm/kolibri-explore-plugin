import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { i18nSetup } from 'kolibri.utils.i18n';
import App from '@/App.vue';

import router from '@/router';
import store from '@/store';
import dynamicLoadComponents from '@/dynamicLoadComponents';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

const ContentDownloadProxyPlugin = {
  install(Vue) {
    Vue.prototype.$download = {
      check: (...args) => {
        return window.kolibri.checkContentDownload(...args);
      },
      start: (...args) => {
        return window.kolibri.startContentDownload(...args);
      },
      retry: (...args) => {
        return window.kolibri.retryContentDownload(...args);
      },
    }
  },
}

Vue.use(ContentDownloadProxyPlugin);

i18nSetup().then(() => {
  dynamicLoadComponents();

  window.app = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});
