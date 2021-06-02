export default {
  namespaced: true,
  state: {
    rootNodes: [],
    searchResult: {},
  },
  mutations: {
    SET_STATE(state, payload) {
      state.rootNodes = payload.rootNodes;
    },
    RESET_STATE(state) {
      state.rootNodes = [];
    },
    SET_SEARCH_RESULT(state, payload) {
      state.searchResult = payload;
    },
  },
};
