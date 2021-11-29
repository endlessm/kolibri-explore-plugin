import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import router from 'kolibri.coreVue.router';
import KolibriApp from 'kolibri_app';
import eosComponents from 'eos-components';
import RootVue from './views/ExploreIndex';
import routes from './routes';
import { setFacilitiesAndConfig } from './modules/coreExplore/actions';
import pluginModule from './modules/pluginModule';
import kolibriApi from './kolibriApi';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.use(eosComponents);

/* eslint-disable class-methods-use-this */
class ExploreModule extends KolibriApp {
  get stateSetters() {
    return [setFacilitiesAndConfig];
  }

  get routes() {
    return routes;
  }

  get RootVue() {
    return RootVue;
  }

  get pluginModule() {
    return pluginModule;
  }

  checkIE() {
    // Detect it's IE11
    const scrollLimit = '-ms-scroll-limit' in document.documentElement.style;
    const imeAlign = '-ms-ime-align' in document.documentElement.style;
    return scrollLimit && imeAlign;
  }

  ready() {
    // after every navigation, block double-clicks
    router.afterEach((toRoute, fromRoute) => {
      this.store.dispatch('blockDoubleClicks');
      this.store.dispatch('resetModuleState', { toRoute, fromRoute });
    });
    super.ready();

    // FIXME: Manual change of hash into the URL doesn't trigger the route in IE11.
    // See: https://github.com/vuejs/vue-router/issues/1849#issuecomment-340767577
    if (this.checkIE()) {
      window.addEventListener(
        'hashchange',
        () => {
          var currentPath = window.location.hash.slice(1);
          if (this.store.state.route.path !== currentPath) {
            router.push(currentPath);
          }
        },
        false
      );
    }

    window.kolibri = kolibriApi;
  }
}

export default new ExploreModule();
