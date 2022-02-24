export default {
  namespaced: true,
  state: {
    rootNodes: [],
    searchResult: {},
    carouselNodes: [],
    lastSearchPromises: {},
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
    SET_CAROUSEL_NODES(state, payload) {
      state.carouselNodes = payload;
    },
    SET_LAST_SEARCH_PROMISE(state, payload) {
      state.lastSearchPromises[payload.kind] = payload.searchPromise;
    },
    RESET_LAST_SEARCH_PROMISES(state) {
      state.lastSearchPromises = {};
    },
  },
};
