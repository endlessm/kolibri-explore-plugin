import { ChannelResource, ContentNodeResource, ContentNodeSearchResource } from 'kolibri.resources';

import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import urls from 'kolibri.urls';

const allButTopicTypes = Object.values(ContentNodeKinds).filter(v => v !== ContentNodeKinds.TOPIC);

class KolibriApi {
  constructor(channelId) {
    this.channelId = channelId;
  }

  themeRenderer() {
    // Doing nothing
    console.log('theme renderer');
  }

  getChannelMetadata() {
    return ChannelResource.fetchModel({ id: this.channelId });
  }

  getChannelFilterOptions() {
    return ChannelResource.fetchFilterOptions(this.channelId).then(response => {
      return {
        availableAuthors: response.data.available_authors,
        availableTags: response.data.available_tags,
        availableKinds: response.data.available_kinds,
      };
    });
  }

  navigateTo(nodeId) {
    const nodeUrl = urls['kolibri:kolibri.plugins.learn:learn']({});
    const path = `/topics/c/${nodeId}`;
    window.location.href = `${nodeUrl}#${path}`;
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
        channel_id: this.channelId,
        parent: options.parent === 'self' ? this.channelId : options.parent,
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
        getParams: {
          search: keyword,
          channel_id: this.channelId,
        },
      }).then(searchResults => {
        return {
          results: searchResults.results,
        };
      });
    }

    return searchPromise;
  }
}

const kolibriApi = new KolibriApi();

export { KolibriApi, kolibriApi as default };
