import urls from 'kolibri.urls';
import { utils } from 'eos-components';
import { ChannelResource, ContentNodeResource, ContentNodeSearchResource } from 'kolibri.resources';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';

import { CarouselItemsLength, PageNames, SEARCH_MAX_RESULTS } from '../../constants';
import { CustomChannelApps, getBigThumbnail, getChannelIcon } from '../../customApps';
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
  const highlightedContentUrl = urls.static(`highlighted-content.json`);

  return (
    fetch(highlightedContentUrl)
      // Parse the JSON:
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      })
      // Get the set of IDs using a rotation logic:
      .then(jsonData => {
        const discoveryData = jsonData['DISCOVERY'];

        // How many full sets?
        const setsNumber = Math.floor(discoveryData.length / CarouselItemsLength);

        // Reduce day number to a valid index:
        const dayNumber = utils.getDayOfYearNumber();
        const i = dayNumber % setsNumber;

        return discoveryData.slice(
          i * CarouselItemsLength,
          i * CarouselItemsLength + CarouselItemsLength
        );
      })
      // Map IDs to content nodes:
      .then(ids => {
        return Promise.all(
          ids.map(id => {
            return window.kolibri
              .getContentById(id)
              .then(node => {
                return node;
              })
              .catch(() => {
                return null;
              });
          })
        );
      })
      // Filter out the content not found:
      .then(nodes => {
        return nodes.filter(n => n !== null);
      })
      // Mutate the nodes so they can be displayed in the carousel:
      .then(nodes => {
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
      })
  );
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
          const rootNodesWithCustomIcons = rootNodes.map(n => {
            n.bigThumbnail = getBigThumbnail(n);
            n.thumbnail = getChannelIcon(n);
            return n;
          });
          store.commit('topicsRoot/SET_STATE', { rootNodes: rootNodesWithCustomIcons });
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

export function searchChannels(store, search, kind) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  return ContentNodeSearchResource.fetchCollection({
    getParams: {
      search,
      kind,
      max_results: SEARCH_MAX_RESULTS,
    },
  }).then(searchResults => {
    const { rootNodes } = store.state.topicsRoot;
    const { channel_ids, results } = searchResults;
    const nodes = results.map(n => ({
      ...n,
      channel: rootNodes.find(c => c.id === n.channel_id),
    }));
    const promises = channel_ids.map(id => ChannelResource.fetchModel({ id }));
    return Promise.all(promises).then(collection => {
      const channels = collection
        .map(c => ({
          ...c,
          thumbnail: getChannelIcon(c),
          title: c.name,
          order: channel_ids.indexOf(c.id),
        }))
        .sort((a, b) => a.order - b.order);

      store.commit('CORE_SET_PAGE_LOADING', false);
      return { kind, channels, nodes };
    });
  });
}
