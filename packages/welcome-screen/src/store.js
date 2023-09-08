import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    packSelected: null,
  },
  mutations: {
    setPackSelected (state, packId) {
      state.packSelected = packId;
    },
  },
});

export default store;
