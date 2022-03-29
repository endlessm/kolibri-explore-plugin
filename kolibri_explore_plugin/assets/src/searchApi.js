import { KolibriApi } from './kolibriApi';
import { ZimSearchChannels } from './customApps';

function searchInsideZimFile(zimfile, searchParams) {
  const { origin } = window.location;
  const url = new URL(`${origin}/zim/search/${zimfile.checksum}.zim`);
  for (const k in searchParams) {
    url.searchParams.append(k, searchParams[k]);
  }
  return fetch(url).then(r => r.json());
}

function zimToNode(zimArticle, node) {
  return {
    ...zimArticle,
    node: node,
    id: `${node.id}${zimArticle.path}`,
    nodeId: node.id,
    channelId: node.channel_id,
    description: zimArticle.snippet,
    kind: 'zim',
    directContent: true,
    nodeUrl: `/topics/${node.channel_id}/c/${node.id}?zimPath=${zimArticle.path}`,
  };
}

export function searchWikiChannelsOnce(store, search, kind) {
  const groupChannels = ZimSearchChannels[kind];
  const promises = groupChannels.map(channel => {
    return wikiChannelSearch(channel, search);
  });
  const searchPromise = Promise.all(promises);
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
  const articles = searchResults.flat();
  store.commit('topicsRoot/SET_SEARCH_RESULT', {
    ...store.state.topicsRoot.searchResult,
    [kind]: {
      channels: [],
      results: articles,
    },
  });
}

function wikiChannelSearch(channelId, query) {
  const kolibri = new KolibriApi(channelId);
  const searchParams = {
    query,
    maxResults: 10,
  };

  // Get all the zim nodes in the channel
  return kolibri
    .getContentByFilter({
      kinds: ['zim'],
    })
    .then(({ results }) => {
      // Do the search for each zim node
      const promises = results.map(node => {
        const [zimfile] = node.files.filter(f => f.extension === 'zim');
        return (
          searchInsideZimFile(zimfile, searchParams)
            // Add the node to ContentNonde to the zim search result
            .then(r => ({ ...r, node }))
        );
      });
      return Promise.all(promises);
    })
    .then(nodes => {
      // Convert the result to a ContentNode like object
      return (
        nodes
          .map(n => n.articles.map(a => zimToNode(a, n.node)))
          .flat()
          // remove duplicates
          .reduce((result, item) => {
            if (result.find(n => n.id === item.id)) {
              return [...result];
            }

            return [...result, item];
          }, [])
      );
    });
}
