import Vue from 'kolibri.lib.vue';

const defaultAppMetadata = {
  contentBackgroundColor: '#1b1b1b',
  contentForegroundColor: '#adb5bd',
  contentBackgroundImage: 'none',
};

function defaultState() {
  return {
    channel: {},
    content: {},
    // used to link directly to content in custom presentation
    customAppContent: {},
    // used in TOPICS_TOPIC, TOPICS_CHANNEL
    contents: [],
    isRoot: null,
    topic: {},
    // used in RECOMMENDED_CONTENT
    recommended: [],
    // used for custom presentations
    appMetadata: defaultAppMetadata,
  };
}

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    SET_STATE(state, payload) {
      state.channel = payload.channel || {};
      state.content = payload.content || {};
      state.contents = payload.contents || [];
      state.isRoot = payload.isRoot || null;
      state.topic = payload.topic || {};
      state.recommended = payload.recommended || [];
    },
    SET_APP_METADATA(state, payload) {
      state.appMetadata = { ...defaultAppMetadata, ...payload };
    },
    RESET_STATE(state) {
      Object.assign(state, defaultState());
    },
    RESET_CONTENT(state) {
      state.content = defaultState().content;
    },
    SET_NODE_PROGRESS(state, progressArray) {
      progressArray.forEach(progress => {
        const contentNode = state.contents.find(node => node.id === progress.id);
        if (contentNode) {
          Vue.set(contentNode, 'progress', progress.progress_fraction);
        }
      });
    },
    SET_CUSTOM_APP_CONTENT(state, payload) {
      state.customAppContent = payload;
    },
  },
};
