import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isUsbConnected: false,
    needsPermission: false,
    packSelected: null,
  },
  mutations: {
    setUsbConnected (state, isUsbConnected) {
      state.isUsbConnected = isUsbConnected;
    },
    setNeedsPermission (state, needsPermission) {
      state.needsPermission = needsPermission;
    },
    setPackSelected (state, packId) {
      state.packSelected = packId;
    },
  },
});

export default store;
