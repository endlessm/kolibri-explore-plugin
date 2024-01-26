import client from 'kolibri.client';
import urls from 'kolibri.urls';
import { ContentNodeProgressResource } from 'kolibri.resources';
import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { assessmentMetaDataState } from 'kolibri.coreVue.vuex.mappers';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import tail from 'lodash/tail';

// adds progress, thumbnail, and breadcrumbs. normalizes pk/id and kind
export function normalizeContentNode(node) {
  return {
    ...node,
    kind: node.parent ? node.kind : ContentNodeKinds.CHANNEL,
    thumbnail: getContentNodeThumbnail(node) || null,
    breadcrumbs: tail(node.ancestors),
    progress: Math.min(node.progress_fraction || 0, 1.0),
  };
}

export function contentState(node, next_content = []) {
  if (!node) return null;
  return {
    next_content,
    ...normalizeContentNode(node),
    ...assessmentMetaDataState(node),
  };
}

export function _collectionState(data) {
  return data.map(item =>
    item.kind === ContentNodeKinds.TOPICS ? normalizeContentNode(item) : contentState(item)
  );
}

/**
 * Cache utility functions
 *
 * These methods are used to manipulate client side cache to reduce requests
 */

export function updateContentNodeProgress(channelId, contentId, progressFraction) {
  /*
   * Update the progress_fraction directly on the model object, so as to prevent having
   * to cache bust the model (and hence the entire collection), because some progress was
   * made on this ContentNode.
   */
  ContentNodeProgressResource.getModel(contentId).set({ progress_fraction: progressFraction });
}

export function currentCollectionExists() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:current_collection_exists'](),
  }).then(({ data }) => {
    return data;
  });
}

export function getCollectionInfo(name, sequence) {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:get_collection_info'](),
    params: { name, sequence },
  }).then(({ data }) => {
    return data.collectionInfo;
  });
}

export function getAllCollectionsInfo() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:get_all_collections_info'](),
  }).then(({ data }) => {
    return data.allCollectionsInfo;
  });
}

export function getDownloadStatus() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
  }).then(({ data }) => {
    return data.status;
  });
}

export function getShouldResume() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:get_should_resume'](),
  }).then(({ data }) => {
    return data;
  });
}

export function resumeDownload() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:resume_download'](),
    method: 'POST',
  }).then(({ data }) => {
    return data.status;
  });
}

export function startDownload(name, sequence) {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:start_download'](),
    method: 'POST',
    data: { name, sequence },
  }).then(({ data }) => {
    return data.status;
  });
}

export function cancelDownload() {
  return client({
    url: urls['kolibri:kolibri_explore_plugin:cancel_download'](),
    method: 'DELETE',
  }).then(({ data }) => {
    return data.status;
  });
}
