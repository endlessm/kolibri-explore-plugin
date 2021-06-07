import store from 'kolibri.coreVue.vuex.store';
import router from 'kolibri.coreVue.router';
import { showTopicsChannel } from '../modules/topicsTree/handlers';
import { showChannels } from '../modules/topicsRoot/handlers';
import { PageNames } from '../constants';

export default [
  {
    name: PageNames.ROOT,
    path: '/',
    handler: () => {
      return router.replace({
        name: PageNames.TOPICS_ROOT,
      });
    },
  },
  {
    name: PageNames.SEARCH,
    path: '/search/:query?',
    handler: toRoute => {
      store.commit('SET_SEARCH_TERM', toRoute.params.query);
      store.commit('SET_PAGE_NAME', PageNames.SEARCH);
    },
  },
  {
    name: PageNames.TOPICS_ROOT,
    path: '/topics',
    handler: () => {
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
    name: PageNames.TOPICS_TOPIC,
    path: '/topics/:channel_id/t/:id',
    handler: toRoute => {
      const { channel_id, id } = toRoute.params;
      store.commit('topicsTree/SET_CUSTOM_APP_CONTENT', { id, kind: 'topic' });
      showTopicsChannel(store, channel_id);
    },
  },
  {
    name: PageNames.TOPICS_CONTENT,
    path: '/topics/:channel_id/c/:id',
    handler: toRoute => {
      const { channel_id, id } = toRoute.params;
      store.commit('topicsTree/SET_CUSTOM_APP_CONTENT', { id, kind: 'content' });
      showTopicsChannel(store, channel_id);
    },
  },
  {
    name: PageNames.TOPICS_CHANNEL,
    path: '/topics/:channel_id',
    handler: toRoute => {
      store.commit('topicsTree/SET_CUSTOM_APP_CONTENT', {});
      showTopicsChannel(store, toRoute.params.channel_id);
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];
