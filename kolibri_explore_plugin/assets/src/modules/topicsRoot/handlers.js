import { ContentNodeResource, ContentNodeSearchResource } from 'kolibri.resources';
import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { PageNames, CUSTOM_PRESENTATION_TITLE } from '../../constants';
import { _collectionState } from '../coreExplore/utils';

export function showChannels(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('SET_PAGE_NAME', PageNames.TOPICS_ROOT);

  return store.dispatch('setAndCheckChannels').then(
    channels => {
      if (!channels.length) {
        return;
      }
      const channelRootIds = channels.map(channel => channel.root);
      ContentNodeResource.fetchCollection({
        getParams: { ids: channelRootIds, user_kind: store.getters.getUserKind },
      }).then(channelCollection => {
        // we want them to be in the same order as the channels list
        const rootNodes = channels
          .map(channel => {
            const node = _collectionState(channelCollection).find(n => n.channel_id === channel.id);
            if (!node) return null;

            // The `channel` comes with additional data that is
            // not returned from the ContentNodeResource.
            // Namely thumbnail, description and tagline (so far)
            node.thumbnail = channel.thumbnail;
            node.description = channel.description;
            node.tagline = channel.tagline;
            return node;
          })
          .filter(Boolean);
        store.commit('topicsRoot/SET_STATE', { rootNodes });
        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
      });
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}

export function showFilteredChannels(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('SET_PAGE_NAME', PageNames.TOPICS_ROOT);

  return store.dispatch('setAndCheckChannels').then(
    channels => {
      if (!channels.length) {
        return;
      }
      const channelRootIds = channels.map(channel => channel.root);
      ContentNodeResource.fetchCollection({
        getParams: { ids: channelRootIds, user_kind: store.getters.getUserKind },
      })
        .then(channelCollection => {
          // we want them to be in the same order as the channels list
          return Promise.all(
            channels.map(channel => {
              const node = _collectionState(channelCollection).find(
                n => n.channel_id === channel.id
              );
              if (!node) return null;

              // The `channel` comes with additional data that is
              // not returned from the ContentNodeResource.
              // Namely thumbnail, description and tagline (so far)
              node.thumbnail = channel.thumbnail;
              node.description = channel.description;
              node.tagline = channel.tagline;
              const getParams = {
                search: CUSTOM_PRESENTATION_TITLE,
                kind: ContentNodeKinds.HTML5,
                channel_id: channel.id,
              };
              return ContentNodeSearchResource.getCollection(getParams)
                .fetch()
                .then(({ results }) => {
                  if (!results.length) return null;

                  const thumb = results[0].files.find(file => file.preset.endsWith('thumbnail'));
                  if (thumb) {
                    node.html5Thumbnail = thumb.storage_url;
                  }
                  return node;
                });
            })
          );
        })
        .then(rootNodes => {
          return rootNodes.filter(Boolean);
        })
        .then(rootNodes => {
          store.commit('topicsRoot/SET_STATE', { rootNodes });
          store.commit('CORE_SET_PAGE_LOADING', false);
          store.commit('CORE_SET_ERROR', null);
        });
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}
