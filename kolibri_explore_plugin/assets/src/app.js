import router from 'kolibri.coreVue.router';
import KolibriApp from 'kolibri_app';
import Vue from 'vue';
import VueMatomo from 'vue-matomo';

import RootVue from './views/ExploreIndex';
import routes from './routes';
import { setFacilitiesAndConfig } from './modules/coreExplore/actions';
import pluginModule from './modules/pluginModule';

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

  ready() {
    // after every navigation, block double-clicks
    router.afterEach((toRoute, fromRoute) => {
      this.store.dispatch('blockDoubleClicks');
      this.store.dispatch('resetModuleState', { toRoute, fromRoute });
    });

    Vue.use(VueMatomo, {
      host: 'matomo',
      router: router._vueRouter,
      siteId: 3,
    });

    super.ready();
  }
}

export default new ExploreModule();
