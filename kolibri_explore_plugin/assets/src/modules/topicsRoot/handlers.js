import { ContentNodeResource } from 'kolibri.resources';
import urls from 'kolibri.urls';
import { PageNames, CustomChannelApps } from '../../constants';
import { _collectionState } from '../coreExplore/utils';

function _findNodes(channels, channelCollection) {
  // we want them to be in the same order as the channels list
  return channels
    .map(channel => {
      const node = _collectionState(channelCollection).find(n => n.channel_id === channel.id);
      if (!node) return null;

      // The `channel` comes with additional data that is
      // not returned from the ContentNodeResource.
      // Namely thumbnail, description and tagline (so far)
      node.thumbnail = channel.thumbnail;
      node.description = channel.description;
      node.tagline = channel.tagline;

      // For custom presentations:
      const appName = CustomChannelApps[channel.id];

      if (appName !== undefined) {
        const backgroundUrl = urls['kolibri:kolibri_explore_plugin:app_file']({
          app: appName,
          filename: 'background.jpg',
        });
        node.cardBackgroundImage = `url(${backgroundUrl})`;
      } else {
        // No custom channel, we create a default card background with the thumbnail
        const colors = [
          ['#99c1f1', '#1a5fb4'],
          ['#8ff0a4', '#26a269'],
          ['#f9f06b', '#e5a50a'],
          ['#ffbe6f', '#c64600'],
          ['#f66151', '#a51d2d'],
          ['#dc8add', '#613583'],
        ];
        const color = colors[node.sort_order % colors.length];
        node.cardBackgroundImage = `linear-gradient(${color[0]}, ${color[1]})`;
      }
      return node;
    })
    .filter(Boolean);
}

function _filterCustomApp(channel) {
  return !!CustomChannelApps[channel.id];
}

export function showChannels(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('SET_PAGE_NAME', PageNames.TOPICS_ROOT);

  return store.dispatch('setAndCheckChannels').then(
    channels => {
      if (!channels.length) {
        return;
      }
      const channelRootIds = channels.map(channel => channel.root);
      ContentNodeResource.fetchCollection({
        getParams: { ids: channelRootIds, user_kind: store.getters.getUserKind },
      })
        .then(collection => _findNodes(channels, collection))
        .then(rootNodes => {
          store.commit('topicsRoot/SET_STATE', { rootNodes });
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
        });
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}

export function showFilteredChannels(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('SET_PAGE_NAME', PageNames.TOPICS_ROOT);

  return store.dispatch('setAndCheckChannels').then(
    channels => {
      const filteredChannels = channels.filter(_filterCustomApp);

      if (!filteredChannels.length) {
        return;
      }
      const channelRootIds = filteredChannels.map(channel => channel.root);
      ContentNodeResource.fetchCollection({
        getParams: { ids: channelRootIds, user_kind: store.getters.getUserKind },
      })
        .then(collection => _findNodes(filteredChannels, collection))
        .then(rootNodes => {
          store.commit('topicsRoot/SET_STATE', { rootNodes });
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
        });
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}
