import _ from 'underscore';
import urls from 'kolibri.urls';
import { ChannelResource } from 'kolibri.resources';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import { ContentNodeResource, ContentNodeSearchResource } from '../../apiResources';
import { CarouselAllowedKinds, CarouselItemsLength, PageNames } from '../../constants';
import { COLLECTIONS_PAGE_SIZE } from '../../constants';
import { CustomChannelApps, RecommendedChannelIDs } from '../../customApps';
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

      if (appName) {
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

function _fetchCarouselNodes(store) {
  const { rootNodes } = store.state.topicsRoot;
  const availableRecommendedChannels = rootNodes.filter(c => RecommendedChannelIDs.includes(c.id));
  const carouselChannels = _.sample(availableRecommendedChannels, CarouselItemsLength);
  const carouselNodeIds = Promise.all(
    carouselChannels.map(channel => {
      return ContentNodeResource.fetchRandomFromChannel({
        kind_in: CarouselAllowedKinds,
        channel_id: channel.id,
      });
    })
  ).then(results => [].concat.apply([], results));

  return carouselNodeIds.then(nodes => {
    return ContentNodeResource.fetchCollection({
      getParams: { ids: nodes.map(n => n.id) },
    }).then(nodes => {
      nodes.forEach(node => {
        const thumbnailUrl = getContentNodeThumbnail(node);
        node.thumbnail = thumbnailUrl;
        node.channel = rootNodes.find(c => c.id === node.channel_id);
        const base = `/topics/${node.channel_id}`;
        if (node.kind === 'topic') {
          node.nodeUrl = `${base}/t/${node.id}`;
        } else {
          node.nodeUrl = `${base}/c/${node.id}`;
        }
      });
      return nodes;
    });
  });
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
          return _fetchCarouselNodes(store);
        })
        .then(carouselNodes => {
          store.commit('topicsRoot/SET_CAROUSEL_NODES', carouselNodes);
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

export function searchChannels(store, params) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('topicsRoot/SET_SEARCH_RESULT', {});

  const paginatedFetch = (page, searchResults) => {
    return ContentNodeSearchResource.fetchCollection({
      getParams: {
        ...params,
        page,
        page_size: COLLECTIONS_PAGE_SIZE,
      },
    }).then(response => {
      const { channel_ids, results } = response;
      searchResults.channel_ids.push(...channel_ids);
      searchResults.results.push(...results);
      if (response.next) {
        return paginatedFetch(page + 1, searchResults);
      } else {
        return searchResults;
      }
    });
  };

  const baseState = {
    channel_ids: [],
    results: [],
  };
  paginatedFetch(1, baseState).then(searchResults => {
    const { rootNodes } = store.state.topicsRoot;
    const { channel_ids, results } = searchResults;
    const nodes = results.map(n => ({
      ...n,
      channel: rootNodes.find(c => c.id === n.channel_id),
    }));
    const promises = channel_ids.map(id => ChannelResource.fetchModel({ id }));
    Promise.all(promises).then(collection => {
      const channels = collection
        .map(c => ({ ...c, title: c.name, order: channel_ids.indexOf(c.id) }))
        .sort((a, b) => a.order - b.order);
      store.commit('topicsRoot/SET_SEARCH_RESULT', {
        ...searchResults,
        channels: channels,
        results: nodes,
      });
      store.commit('CORE_SET_PAGE_LOADING', false);
    });
  });
}
