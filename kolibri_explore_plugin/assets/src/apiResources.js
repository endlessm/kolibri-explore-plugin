import _ from 'underscore';

import { Resource } from 'kolibri.lib.apiResource';
import Store from 'kolibri.coreVue.vuex.store';

// Copied from kolibri/core/assets/src/api-resources/contentNode.js
export const ContentNodeResource = new Resource({
  name: 'customcontentnode',
  // useContentCacheKey: true,
  namespace: 'kolibri_explore_plugin',
  fetchDescendants(ids, getParams = {}) {
    return this.getListEndpoint('descendants', { ids, ...getParams });
  },
  fetchDescendantsAssessments(ids) {
    return this.getListEndpoint('descendants_assessments', { ids });
  },
  fetchCopies(content_id) {
    return this.fetchDetailCollection('copies', content_id);
  },
  fetchCopiesCount(getParams = {}) {
    return this.fetchListCollection('copies_count', getParams);
  },
  fetchNextContent(id) {
    return this.fetchDetailModel('next_content', id);
  },
  fetchNodeAssessments(ids) {
    return this.getListEndpoint('node_assessments', { ids });
  },
  fetchRecommendationsFor(id, getParams) {
    return this.fetchDetailCollection('recommendations_for', id, getParams);
  },
  fetchResume(getParams) {
    return this.fetchDetailCollection('resume', Store.getters.currentUserId, getParams);
  },
  fetchPopular(getParams) {
    return this.fetchListCollection('popular', getParams);
  },
  fetchNextSteps(getParams) {
    return this.fetchDetailCollection('next_steps', Store.getters.currentUserId, getParams);
  },
  fetchChannelAsync(channelId, parent = null) {
    // Fetch all content for a channel recursively, making a request to the
    // backend for each level in the nodes tree
    const getParams = {
      channel_id: channelId,
      parent: parent || channelId,
    };

    return this.fetchCollection({ getParams }).then(n => {
      return Promise.all(n).then(nodes => {
        const promises = nodes
          .filter(node => node.kind === 'topic')
          .map(node => this.fetchChannelAsync(channelId, node.id));

        return Promise.all(promises).then(array => {
          return new Promise(resolve => {
            resolve(_.union(nodes, _.flatten(array)));
          });
        });
      });
    });
  },
});

export const ContentNodeSearchResource = new Resource({
  name: 'customcontentnodesearch',
  namespace: 'kolibri_explore_plugin',
});
