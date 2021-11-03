import { ContentNodeResource, ContentNodeSearchResource } from 'kolibri.resources';

import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';

const allButTopicTypes = Object.values(ContentNodeKinds).filter(v => v !== ContentNodeKinds.TOPIC);

class KolibriApi {
  navigateTo(nodeId) {
    // TODO: Link to the learn plugin
    console.log(`show node id ${nodeId}`);
  }

  getContentByFilter(options) {
    const { kinds, onlyContent, onlyTopics } = options;

    if (onlyContent && onlyTopics) {
      const err = new Error('onlyContent and onlyTopics can not be used at the same time');
      throw err;
    }

    return ContentNodeResource.fetchCollection({
      getParams: {
        ids: options.ids,
        authors: options.authors,
        tags: options.tags,
        parent: options.parent === 'self' ? this.topic.id : options.parent,
        max_results: options.maxResults ? options.maxResults : 50,
        cursor: options.cursor,
        kind: onlyTopics ? ContentNodeKinds.TOPIC : undefined,
        kind_in: onlyContent ? allButTopicTypes : kinds,
        // Using timestamp to avoid cache
        random: options.random ? Date.now().toString() : undefined,
      },
    }).then(contentNodes => {
      return {
        maxResults: options.maxResults ? options.maxResults : 50,
        more: contentNodes.more,
        results: contentNodes.results,
      };
    });
  }

  getContentById(id) {
    return ContentNodeResource.fetchModel({ id: id });
  }

  searchContent(options) {
    let searchPromise;
    const { keyword } = options;
    if (!keyword) {
      searchPromise = Promise.resolve({
        page: 0,
        pageSize: 0,
        results: [],
      });
    } else {
      searchPromise = ContentNodeSearchResource.fetchCollection({
        getParams: { search: keyword },
      }).then(searchResults => {
        return {
          results: searchResults.results,
        };
      });
    }

    return searchPromise;
  }
}

export default new KolibriApi();
