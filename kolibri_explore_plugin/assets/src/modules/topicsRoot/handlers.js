import partial from 'lodash/partial';
import urls from 'kolibri.urls';
import { utils } from 'ek-components';
import router from 'kolibri.coreVue.router';
import plugin_data from 'plugin_data';
import { ContentNodeSearchResource } from 'kolibri.resources';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import { currentLanguage, languageIdToCode } from 'kolibri.utils.i18n';

import { ChannelResource, ContentNodeResource } from '../../apiResources';
import { CarouselItemsLength, SEARCH_MAX_RESULTS, PageNames } from '../../constants';
import { CustomChannelApps, getBigThumbnail, getChannelIcon } from '../../customApps';
import {
  currentCollectionExists,
  getDownloadStatus,
  getShouldResume,
  resumeDownload,
  startDownload,
  _collectionState,
} from '../coreExplore/utils';

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

function _fetchCarouselNodes(store) {
  if (!plugin_data.useEkIguanaPage) {
    // These carousel nodes are only relevant to EK Iguana:
    return Promise.resolve([]);
  }

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

function _isDownloadComplete(status) {
  return status.stage === 'COMPLETED';
}

function _isDownloadOngoing(status) {
  return status.stage !== 'COMPLETED' && status.stage !== 'NOT_STARTED';
}

export function decideWelcome(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  if (plugin_data.useEkIguanaPage) {
    console.debug('Welcome: Redirecting to Explore page...');
    router.replace({ name: PageNames.TOPICS_ROOT });
    store.commit('CORE_SET_PAGE_LOADING', false);
    store.commit('CORE_SET_ERROR', null);
    return Promise.resolve();
  }

  return Promise.all([currentCollectionExists(), getDownloadStatus(), getShouldResume()]).then(
    ([currentExists, status, { shouldResume, name, sequence }]) => {
      if (currentExists || _isDownloadComplete(status)) {
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
        console.debug('Welcome: Download complete, redirecting to Explore page...');
        router.replace({ name: PageNames.TOPICS_ROOT });
      } else if (_isDownloadOngoing(status) || shouldResume) {
        console.debug('Welcome: Redirecting to Download page...');
        // The catch here is needed for ignoring redundant navigation errors.
        router.replace({ name: PageNames.DOWNLOAD, params: { name, sequence } }).catch(() => {});
        store.commit('SET_PAGE_NAME', PageNames.DOWNLOAD);
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
      } else {
        console.debug('Welcome: Redirecting to Welcome page...');
        // The catch here is needed for ignoring redundant navigation errors.
        router.replace({ name: PageNames.WELCOME_ROOT }).catch(() => {});
        store.commit('SET_PAGE_NAME', PageNames.WELCOME_ROOT);
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
      }
    }
  );
}

export function decidePackSelection(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  if (languageIdToCode(currentLanguage) === 'es') {
    console.debug('Welcome: Downloading Spanish pack directly...');
    router.replace({ name: PageNames.DOWNLOAD, params: { name: 'spanish', sequence: '0001' } });
  } else {
    store.commit('SET_PAGE_NAME', PageNames.WELCOME_PACK_SELECTION);
  }

  store.commit('CORE_SET_PAGE_LOADING', false);
  store.commit('CORE_SET_ERROR', null);
}

export function decideDownload(store, name, sequence) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  return Promise.all([getDownloadStatus(), getShouldResume()]).then(
    ([status, { shouldResume }]) => {
      if (_isDownloadComplete(status)) {
        console.debug('Already downloaded, redirecting to Explore page...');
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
        router.replace({ name: PageNames.TOPICS_ROOT });
      } else if (_isDownloadOngoing(status)) {
        console.debug('A collections download is ongoing...');
        store.commit('SET_PAGE_NAME', PageNames.DOWNLOAD);
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
      } else if (shouldResume) {
        console.debug('Resuming previous collections download...');
        return resumeDownload().then(() => {
          store.commit('SET_PAGE_NAME', PageNames.DOWNLOAD);
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
        });
      } else {
        console.debug('Downloading starter pack...');
        return startDownload(name, sequence).then(() => {
          store.commit('SET_PAGE_NAME', PageNames.DOWNLOAD);
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
        });
      }
    }
  );
}

export function showChannels(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  ChannelResource.useContentCacheKey = false;
  ChannelResource.clearCache();
  return store
    .dispatch('setAndCheckChannels')
    .then(
      channels => {
        if (!channels.length) {
          router.replace({ name: PageNames.CONTENT_UNAVAILABLE });
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
          return;
        }
        const channelRootIds = channels.map(channel => channel.root);
        ContentNodeResource.fetchCollection({
          getParams: {
            ids: channelRootIds,
            user_kind: store.getters.getUserKind,
            no_available_filtering: true,
          },
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
    )
    .finally(() => {
      ChannelResource.useContentCacheKey = true;
    });
}

export function searchChannelsOnce(store, search, kind, includeUnavailable) {
  const searchPromise = ContentNodeSearchResource.fetchCollection({
    getParams: {
      search,
      kind,
      max_results: SEARCH_MAX_RESULTS,
      ...(includeUnavailable && { no_available_filtering: true }),
    },
  });
  store.commit('topicsRoot/SET_LAST_SEARCH_PROMISE', { kind, searchPromise });
  return new Promise((resolve, reject) => {
    searchPromise.then(searchResults => {
      const { lastSearchPromises } = store.state.topicsRoot;
      if (searchPromise == lastSearchPromises[kind]) {
        store.commit('topicsRoot/SET_LAST_SEARCH_PROMISE', { kind, searchPromise: null });
        setSearchResults(store, searchResults, kind);
        resolve(searchResults);
      } else {
        reject(new Error('Dropping a previous fetch while searching.'));
      }
    });
  });
}

function setSearchResults(store, searchResults, kind) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  const { rootNodes } = store.state.topicsRoot;
  const { channel_ids, results } = searchResults;
  if (!results.length) {
    return;
  }
  const addChannelToNode = partial(utils.addChannelToNode, rootNodes);
  const nodes = results.map(addChannelToNode);
  const promises = channel_ids.map(id => ChannelResource.fetchModel({ id }));
  Promise.all(promises).then(collection => {
    const channels = collection
      .map(c => ({
        ...c,
        thumbnail: getChannelIcon(c),
        title: c.name,
        order: channel_ids.indexOf(c.id),
      }))
      .sort((a, b) => a.order - b.order);
    store.commit('topicsRoot/SET_SEARCH_RESULT', {
      ...store.state.topicsRoot.searchResult,
      [kind]: {
        ...searchResults,
        channels: channels,
        results: nodes,
      },
    });
    store.commit('CORE_SET_PAGE_LOADING', false);
  });
}

export function setShowSideNav(store, showSideNav) {
  store.commit('topicsRoot/SET_SHOW_SIDE_NAV', showSideNav);
}
