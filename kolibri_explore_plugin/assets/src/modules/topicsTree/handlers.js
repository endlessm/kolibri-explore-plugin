import { ContentNodeResource, ContentNodeProgressResource } from 'kolibri.resources';
import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import ConditionalPromise from 'kolibri.lib.conditionalPromise';
import router from 'kolibri.coreVue.router';
import urls from 'kolibri.urls';
import axios from 'axios';
import { PageNames } from '../../constants';
import { getAppNameByID } from '../../customApps';
import { _collectionState, normalizeContentNode, contentState } from '../coreExplore/utils';

export function showTopicsTopic(store, { id, isRoot = false }) {
  return store.dispatch('loading').then(() => {
    store.commit('SET_PAGE_NAME', isRoot ? PageNames.TOPICS_CHANNEL : PageNames.TOPICS_TOPIC);
    const promises = [
      ContentNodeResource.fetchModel({ id, force: true }), // the topic
      ContentNodeResource.fetchCollection({
        getParams: {
          parent: id,
          user_kind: store.getters.getUserKind,
        },
      }), // the topic's children
      store.dispatch('setChannelInfo'),
    ];

    return ConditionalPromise.all(promises).only(
      samePageCheckGenerator(store),
      ([topic, children]) => {
        const currentChannel = store.getters.getChannelObject(topic.channel_id);
        if (!currentChannel) {
          router.replace({ name: PageNames.CONTENT_UNAVAILABLE });
          return;
        }
        if (isRoot) {
          topic.description = currentChannel.description;
          topic.tagline = currentChannel.tagline;
          topic.thumbnail = currentChannel.thumbnail;
        }
        store.commit('topicsTree/SET_STATE', {
          isRoot,
          channel: currentChannel,
          topic: normalizeContentNode(topic),
          contents: _collectionState(children),
        });

        // Only load contentnode progress if the user is logged in
        if (store.getters.isUserLoggedIn) {
          if (children.length > 0) {
            ContentNodeProgressResource.fetchCollection({
              getParams: { parent: id },
            }).then(progresses => {
              store.commit('topicsTree/SET_NODE_PROGRESS', progresses);
            });
          }
        }

        store.dispatch('notLoading');
        store.commit('CORE_SET_ERROR', null);
      },
      error => {
        store.dispatch('handleApiError', error);
      }
    );
  });
}

function _getAppMetadata(appName) {
  if (appName) {
    const url = urls['kolibri:kolibri_explore_plugin:app_metadata']({ app: appName });
    return axios.get(url);
  } else {
    return new Promise();
  }
}

function _parseAppMetadata(data, appName) {
  if (!data) {
    return {};
  }

  const newData = { ...data };

  if (data.contentBackgroundImage) {
    const backgroundUrl = urls['kolibri:kolibri_explore_plugin:app_file']({
      app: appName,
      filename: data.contentBackgroundImage,
    });
    newData.contentBackgroundImage = `url(${backgroundUrl})`;
  }

  return newData;
}

export function showCustomContent(store, id) {
  store.commit('SET_EMPTY_LOGGING_STATE');
  store.commit('CORE_SET_PAGE_LOADING', true);

  const promises = [store.dispatch('setChannelInfo')];

  ConditionalPromise.all(promises).only(
    samePageCheckGenerator(store),
    () => {
      const currentChannel = store.getters.getChannelObject(id);
      if (!currentChannel) {
        router.replace({ name: PageNames.CONTENT_UNAVAILABLE });
        return;
      }
      store.commit('topicsTree/SET_STATE', {
        channel: currentChannel,
      });

      const appName = getAppNameByID(id);
      _getAppMetadata(appName).then(({ data }) => {
        store.commit('topicsTree/SET_APP_METADATA', _parseAppMetadata(data, appName));
      });

      store.commit('CORE_SET_PAGE_LOADING', false);
      store.commit('CORE_SET_ERROR', null);
    },
    error => {
      store.dispatch('handleApiError', error);
    }
  );
}

export function showTopicsChannel(store, id) {
  return store.dispatch('loading').then(() => {
    store.commit('SET_PAGE_NAME', PageNames.TOPICS_CHANNEL);
    return showCustomContent(store, id);
  });
}

export function showTopicsContent(store, id) {
  store.commit('SET_EMPTY_LOGGING_STATE');
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('SET_PAGE_NAME', PageNames.TOPICS_CONTENT);

  const promises = [
    ContentNodeResource.fetchModel({ id }),
    ContentNodeResource.fetchNextContent(id),
    store.dispatch('setChannelInfo'),
  ];
  ConditionalPromise.all(promises).only(
    samePageCheckGenerator(store),
    ([content, nextContent]) => {
      const currentChannel = store.getters.getChannelObject(content.channel_id);
      if (!currentChannel) {
        router.replace({ name: PageNames.CONTENT_UNAVAILABLE });
        return;
      }
      store.commit('topicsTree/SET_STATE', {
        content: contentState(content, nextContent),
        channel: currentChannel,
      });
      store.commit('CORE_SET_PAGE_LOADING', false);
      store.commit('CORE_SET_ERROR', null);
    },
    error => {
      store.dispatch('handleApiError', error);
    }
  );
}
