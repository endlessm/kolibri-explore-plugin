import { get } from '@vueuse/core';
import useChannels from '../../composables/useChannels';
import { pageNameToModuleMap } from '../../constants';

const { channels } = useChannels();

export function resetModuleState(store, lastPageName) {
  const moduleName = pageNameToModuleMap[lastPageName];
  if (moduleName) {
    store.commit(`${moduleName}/RESET_STATE`);
  }
}

export function setAndCheckChannels() {
  return get(channels);
}

export function setFacilitiesAndConfig(store) {
  return store.dispatch('getFacilities').then(() => {
    return store.dispatch('getFacilityConfig');
  });
}
