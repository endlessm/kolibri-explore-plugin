import { Resource } from 'kolibri.lib.apiResource';
import {
  ChannelResource as _ChannelResource,
  ContentNodeResource as _ContentNodeResource,
} from 'kolibri.resources';

export const ChannelResource = Object.create(_ChannelResource);
// Use the explore API endpoint.
ChannelResource.name = 'kolibri:kolibri_explore_plugin:channel';
// Restore the standard Resource client that doesn't add the
// contentCacheKey query parameter.
ChannelResource.client = Resource.prototype.client;

export const ContentNodeResource = Object.create(_ContentNodeResource);
// Use the explore API endpoint.
ContentNodeResource.name = 'kolibri:kolibri_explore_plugin:contentnode';
// Restore the standard Resource client that doesn't add the
// contentCacheKey query parameter.
ContentNodeResource.client = Resource.prototype.client;

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
