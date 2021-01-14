import store from 'kolibri.coreVue.vuex.store';
import router from 'kolibri.coreVue.router';
import {
  showTopicsTopic,
  showTopicsChannel,
  showTopicsContent,
} from '../modules/topicsTree/handlers';
import { showFilteredChannels } from '../modules/topicsRoot/handlers';
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
    name: PageNames.TOPICS_ROOT,
    path: '/topics',
    handler: () => {
      showFilteredChannels(store);
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
    name: PageNames.TOPICS_CHANNEL,
    path: '/topics/:channel_id',
    handler: toRoute => {
      showTopicsChannel(store, toRoute.params.channel_id);
    },
  },
  {
    name: PageNames.TOPICS_TOPIC,
    path: '/topics/t/:id',
    handler: toRoute => {
      showTopicsTopic(store, { id: toRoute.params.id });
    },
  },
  {
    name: PageNames.TOPICS_CONTENT,
    path: '/topics/c/:id',
    handler: toRoute => {
      showTopicsContent(store, toRoute.params.id);
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];
