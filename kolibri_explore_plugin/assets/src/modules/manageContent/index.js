function defaultState() {
  return {
    // Content download tasks indexed by channel ID and content ID:
    contentDownloadTasks: {},
  };
}

export default {
  namespaced: true,
  state: defaultState,
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, payload);
    },
    RESET_STATE(state) {
      Object.assign(state, defaultState());
    },
    SET_ALL_CONTENT_DOWNLOAD_TASKS(state, contentDownloadTasks) {
      state.contentDownloadTasks = { ...contentDownloadTasks };
    },
    SET_CONTENT_DOWNLOAD_TASK(state, { channelId, contentId, task }) {
      if (!(channelId in state.contentDownloadTasks)) {
        state.contentDownloadTasks[channelId] = {};
      }
      state.contentDownloadTasks[channelId][contentId] = task;
    },
  },
  getters: {
    getContentDownloadTask: state => (channelId, contentId) => {
      return state.contentDownloadTasks[channelId]?.[contentId];
    },
  },
};
