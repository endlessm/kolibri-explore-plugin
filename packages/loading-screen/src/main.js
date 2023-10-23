import Vue from 'vue';
import VueIntl from 'vue-intl'
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from '@/App.vue';

import Loading from '@/views/Loading.vue';
import LoadingInitial from '@/views/LoadingInitial.vue';
import LoadingError from '@/views/LoadingError.vue';
import LoadingRetry from '@/views/LoadingRetry.vue';
import store from "@/store";

// Language codes are RFC 5646 (https://datatracker.ietf.org/doc/html/rfc5646)
const supportedLocales = ['en', 'es'];
const defaultLocale = 'en';
const requestedLocales = navigator.languages;

function loadLocaleData(locale) {
  if (!supportedLocales.includes(locale))
    throw "Unsupported locale";

  return import(/* webpackMode: "eager" */ `../compiled-lang/${locale}.json`)
    .then(messages => [locale, messages]);
}

async function loadBestLocaleData(locales) {
  for (const locale of locales) {
    try {
      return await loadLocaleData(locale);
    } catch {
      continue;
    }
  }

  // Try again with only the locale's language.
  for (const lang of locales.map(l => l.split('-')[0].toLowerCase())) {
    try {
      return await loadLocaleData(lang);
    } catch {
      continue;
    }
  }

  return await loadLocaleData(defaultLocale);
}

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = false;

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

loadBestLocaleData(requestedLocales).then(out => {
  const [loadedLocale, messages] = out;

  console.debug(`Loaded locale data for ${loadedLocale} (requested ${requestedLocales})`);

  Vue.use(VueIntl, { defaultLocale });
  Vue.setLocale(loadedLocale);
  Vue.registerMessages(loadedLocale, messages);
  // Note: We don’t import any locale data (date formats, currency, etc.) because
  // it’s large and not needed for the small number of strings in loading-screen.

  window.app = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});
