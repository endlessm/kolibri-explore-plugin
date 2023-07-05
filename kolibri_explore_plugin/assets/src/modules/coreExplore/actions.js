import { ChannelResource } from '../../apiResources';
import { pageNameToModuleMap } from '../../constants';

export function resetModuleState(store, lastPageName) {
  const moduleName = pageNameToModuleMap[lastPageName];
  if (moduleName) {
    store.commit(`${moduleName}/RESET_STATE`);
  }
}

function _channelListState(data) {
  return data.map(channel => ({
    id: channel.id,
    title: channel.name,
    description: channel.description,
    tagline: channel.tagline,
    root_id: channel.root,
    last_updated: channel.last_updated,
    version: channel.version,
    thumbnail: channel.thumbnail,
    num_coach_contents: channel.num_coach_contents,
  }));
}

// Like upstream setChannelInfo but also retrieves unavailable channels:
export function setEkChannelInfo(store) {
  return ChannelResource.fetchCollection().then(
    channelsData => {
      store.commit('SET_CORE_CHANNEL_LIST', _channelListState(channelsData));
      return channelsData;
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}

export function setAndCheckChannels(store) {
  return store.dispatch('setEkChannelInfo').then(
    channels => {
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
