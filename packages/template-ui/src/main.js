import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
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

// FIXME hook i18n. This is a workaround to allow EK components that
// use internationalization in the template-ui.
Vue.prototype.$tr = function $tr(messageId) {
  return this.$options.$trs[messageId];
};

dynamicLoadComponents();

window.app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
