import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import router from 'kolibri.coreVue.router';
import KolibriApp from 'kolibri_app';
import EkComponents from 'ek-components';
import RootVue from './views/ExploreIndex';
import routes from './routes';
import { setFacilitiesAndConfig } from './modules/coreExplore/actions';
import pluginModule from './modules/pluginModule';
import kolibriApi from './kolibriApi';
import ContentDownloadPlugin from './contentDownloadPlugin';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['ms-store-badge'];

Vue.use(EkComponents);

Vue.use(ContentDownloadPlugin);

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

    // Reemit the resize event on fullscreenchange to fix the problems with epub size
    //
    // There's a weird behaviour in the that produces a race condition with the
    // full-screen resize event, making epub content not rendering correctly
    // when toggling full-screen.
    // https://phabricator.endlessm.com/T33246
    window.addEventListener(
      'fullscreenchange',
      () => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 300);
      },
      false
    );

    window.kolibri = kolibriApi;
  }
}

export default new ExploreModule();
