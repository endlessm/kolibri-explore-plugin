import store from 'kolibri.coreVue.vuex.store';
import plugin_data from 'plugin_data';
import { showTopicsChannel } from '../modules/topicsTree/handlers';
import {
  decideWelcome,
  decidePackSelection,
  decideDownload,
  showChannels,
} from '../modules/topicsRoot/handlers';
import { PageNames } from '../constants';

export default [
  {
    name: PageNames.ROOT,
    path: '/',
    // Redirect to Search page if Discovery is hidden.
    redirect: plugin_data.hideDiscoveryTab ? { name: PageNames.SEARCH } : undefined,
    handler: () => {
      decideWelcome(store);
    },
  },
  {
    name: PageNames.WELCOME_ROOT,
    path: '/welcome',
    handler: (_toRoute, fromRoute) => {
      if (fromRoute.name !== PageNames.ROOT) {
        // If not coming from the / redirect, do it here:
        decideWelcome(store);
      }
    },
  },
  {
    name: PageNames.WELCOME_PACK_SELECTION,
    path: '/welcome/select-pack',
    handler: () => {
      decidePackSelection(store);
    },
  },
  {
    name: PageNames.WELCOME_PACK_READY,
    path: '/welcome/pack-ready/:name/:sequence',
    handler: () => {
      store.commit('SET_PAGE_NAME', PageNames.WELCOME_PACK_READY);
    },
  },
  {
    name: PageNames.DOWNLOAD,
    path: '/download/:name/:sequence',
    handler: toRoute => {
      decideDownload(store, toRoute.params.name, toRoute.params.sequence);
    },
  },
  {
    name: PageNames.SEARCH,
    path: '/search/:query?',
    handler: toRoute => {
      if (toRoute.params.query) {
        store.commit('SET_SEARCH_TERM', toRoute.params.query);
      }
      store.commit('SET_PAGE_NAME', PageNames.SEARCH);
      showChannels(store);
    },
  },
  {
    name: PageNames.TOPICS_ROOT,
    path: '/topics',
    // Redirect to Search page if Discovery is hidden.
    redirect: plugin_data.hideDiscoveryTab ? { name: PageNames.SEARCH } : undefined,
    handler: () => {
      store.commit('SET_PAGE_NAME', PageNames.TOPICS_ROOT);
      showChannels(store);
    },
  },
  {
    name: PageNames.CONTENT_UNAVAILABLE,
    path: '/content-unavailable',
    handler: () => {
      store.commit('SET_PAGE_NAME', PageNames.CONTENT_UNAVAILABLE);
      store.commit('CORE_SET_PAGE_LOADING', false);
      store.commit('CORE_SET_ERROR', null);
    },
  },
  {
    name: PageNames.TOPICS_TEST,
    path: '/topics/:channel_id/test',
    handler: toRoute => {
      store.commit('topicsTree/SET_CUSTOM_APP_PARAMETERS', { test: true });
      showTopicsChannel(store, toRoute.params.channel_id);
    },
  },
  {
    name: PageNames.TOPICS_TOPIC,
    path: '/topics/:channel_id/t/:id',
    handler: (toRoute, fromRoute) => {
      if (fromRoute) {
        store.commit('topicsTree/SET_BACK_FROM_CUSTOM_PAGE', fromRoute.name);
      }
      const { channel_id, id } = toRoute.params;
      store.commit('topicsTree/SET_CUSTOM_APP_PARAMETERS', { topicId: id });
      showTopicsChannel(store, channel_id);
    },
  },
  {
    name: PageNames.TOPICS_CONTENT,
    path: '/topics/:channel_id/c/:id',
    handler: (toRoute, fromRoute) => {
      const { channel_id, id } = toRoute.params;
      if (fromRoute) {
        store.commit('topicsTree/SET_BACK_FROM_CUSTOM_PAGE', fromRoute.name);
      }
      store.commit('topicsTree/SET_CUSTOM_APP_PARAMETERS', { contentId: id });
      showTopicsChannel(store, channel_id);
    },
  },
  {
    name: PageNames.TOPICS_CHANNEL,
    path: '/topics/:channel_id',
    handler: (toRoute, fromRoute) => {
      if (fromRoute) {
        store.commit('topicsTree/SET_BACK_FROM_CUSTOM_PAGE', fromRoute.name);
      }
      store.commit('topicsTree/SET_CUSTOM_APP_PARAMETERS', {});
      showTopicsChannel(store, toRoute.params.channel_id);
    },
  },
  {
    name: PageNames.CONTENT,
    path: '/content/:content_id',
    handler: toRoute => {
      store.commit('SET_CONTENT_ID', toRoute.params.content_id);
      store.commit('SET_PAGE_NAME', PageNames.CONTENT);
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];
