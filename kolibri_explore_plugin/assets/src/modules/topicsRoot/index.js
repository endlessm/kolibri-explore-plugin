export default {
  namespaced: true,
  state: {
    rootNodes: [],
    carouselNodes: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      state.rootNodes = payload.rootNodes;
    },
    RESET_STATE(state) {
      state.rootNodes = [];
    },
    SET_CAROUSEL_NODES(state, payload) {
      state.carouselNodes = payload;
    },
  },
};
