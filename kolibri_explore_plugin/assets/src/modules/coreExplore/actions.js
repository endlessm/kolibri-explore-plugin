import { pageNameToModuleMap } from '../../constants';

export function resetModuleState(store, lastPageName) {
  const moduleName = pageNameToModuleMap[lastPageName];
  if (moduleName) {
    store.commit(`${moduleName}/RESET_STATE`);
  }
}

export function setAndCheckChannels(store) {
  return store.dispatch('setChannelInfo').then(
    channels => {
      if (!channels.length) {
        store.commit('SET_SHOW_INSTALL_CONTENT', true);
      }
      return channels;
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}

export function setFacilitiesAndConfig(store) {
  return store.dispatch('getFacilities').then(() => {
    return store.dispatch('getFacilityConfig');
  });
}
