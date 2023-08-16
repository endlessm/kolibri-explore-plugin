import { TaskStatuses } from 'kolibri.utils.syncTaskUtils';
import { constants } from 'ek-components';
import { TaskResource } from 'kolibri.resources';
import store from 'kolibri.coreVue.vuex.store';

function _mapTaskStatusToDownloadState(task) {
  switch (task.status) {
    case TaskStatuses.CANCELED:
      return constants.DownloadState.READY;
    case TaskStatuses.IN_PROGRESS:
    case TaskStatuses.PENDING:
    case TaskStatuses.RUNNING:
    case TaskStatuses.QUEUED:
    case TaskStatuses.SCHEDULED:
    case TaskStatuses.CANCELLING:
      return constants.DownloadState.DOWNLOADING;
    case TaskStatuses.COMPLETED:
      return constants.DownloadState.COMPLETED;
    case TaskStatuses.FAILED:
      return constants.DownloadState.FAILED;
    default:
      return constants.DownloadState.NOT_CHECKED;
  }
}

export function checkContentDownload(channelId, contentId) {
  // Check if task ID is in the store:
  const task = store.getters['manageContent/getContentDownloadTask'](channelId, contentId);
  // If not, the resource is ready for downloading:
  if (task === undefined) {
    return new Promise(resolve => {
      resolve(constants.DownloadState.READY);
    });
  }
  // Else, check how the task is going and update the task in the store:
  return TaskResource.get(task.id).then(newTask => {
    store.commit('manageContent/SET_CONTENT_DOWNLOAD_TASK', {
      channelId,
      contentId,
      task: newTask,
    });
    return _mapTaskStatusToDownloadState(newTask);
  });
}

export function startContentDownload(channelId, contentId) {
  const taskParams = {
    channel_id: channelId,
    channel_name: 'foo',
    node_ids: [contentId],
    type: 'kolibri_explore_plugin.tasks.remotecontentimport',
  };

  return TaskResource.startTask(taskParams)
    .then(task => {
      store.commit('manageContent/SET_CONTENT_DOWNLOAD_TASK', { channelId, contentId, task });
      return _mapTaskStatusToDownloadState(task);
    })
    .catch(() => {
      return constants.DownloadState.FAILED;
    });
}

export function retryContentDownload(channelId, contentId) {
  // Check if task ID is in the store:
  const task = store.getters['manageContent/getContentDownloadTask'](channelId, contentId);
  // If not, the resource is ready for downloading:
  if (task === undefined) {
    return new Promise(resolve => {
      resolve(constants.DownloadState.READY);
    });
  }
  // Else, restart the task and update the task in the store:
  return TaskResource.restart(task.id).then(newTask => {
    store.commit('manageContent/SET_CONTENT_DOWNLOAD_TASK', {
      channelId,
      contentId,
      task: newTask,
    });
    return _mapTaskStatusToDownloadState(newTask);
  });
}
