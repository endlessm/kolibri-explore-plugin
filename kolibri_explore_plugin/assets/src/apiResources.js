import { Resource } from 'kolibri.lib.apiResource';

export const ExternalContentTagResource = new Resource({
  name: 'externalcontenttag',
  namespace: 'kolibri_explore_plugin',
});

export const ContentNodeExtrasResource = new Resource({
  name: 'contentnodeextras',
  namespace: 'kolibri_explore_plugin',
  fetchByExternalTag(tag, getParams = {}) {
    return this.getListEndpoint('by_external_tag', { tag, ...getParams });
  },
});
