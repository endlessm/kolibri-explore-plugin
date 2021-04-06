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
  // Custom filter implementation for the new filter API:
  // https://www.notion.so/API-Specification-for-kolibri-object-6553f24706b34f13b28a0f1dffc70f8a
  getContentByFilter(options) {
    return this.fetchCollection({
      getParams: {
        channel_id: options.parent,
        user_kind: options.userKind,
      },
    }).then(promises => {
      return Promise.all(promises).then(nodes => {
        if (!options.filters) {
          return nodes;
        }

        let filtered = nodes;
        // Filter by media type
        const mediaType = options.filters['Media Type'];
        if (mediaType && mediaType.length) {
          filtered = filtered.filter(node => {
            if (node.kind === 'topic') {
              return true;
            }

            return mediaType.some(m => node.kind === m);
          });
        }
        return filtered;
      });
    });
  },
});
