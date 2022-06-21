import { KolibriApi } from './kolibriApi';

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
    nodeUrl: `/topics/${node.channel_id}/c/${node.id}?zimPath=${zimArticle.path}`,
  };
}

export function wikiChannelSearch(channelId, query) {
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
      return nodes
        .map(n => n.articles.map(a => zimToNode(a, n.node)))
        .reduce((result, item) => result.concat(item), []);
    });
}
