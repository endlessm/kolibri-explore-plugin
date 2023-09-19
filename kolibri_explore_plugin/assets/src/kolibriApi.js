import urls from 'kolibri.urls';
import { ContentNodeSearchResource } from 'kolibri.resources';

import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';

import router from 'kolibri.coreVue.router';
import store from 'kolibri.coreVue.vuex.store';
import { createTranslator as kolibriCreateTranslator } from 'kolibri.utils.i18n';
import { utils } from 'ek-components';
import { ChannelResource, ContentNodeResource } from './apiResources';
import { showTopicsContentInLightbox } from './modules/topicsTree/handlers';
import { PageNames } from './constants';
import { getChannelIcon } from './customApps';
import {
  checkContentDownload,
  startContentDownload,
  retryContentDownload,
} from './modules/manageContent/handlers';

const DEFAULT_HIDE_UNAVAILABLE = false;

// Cache of template-ui translators:
const TRANSLATORS = {};

class KolibriApi {
  constructor(channelId) {
    this.channelId = channelId;
  }

  themeRenderer() {
    // Doing nothing
    console.log('theme renderer');
  }

  getChannelMetadata() {
    return ChannelResource.fetchModel({ id: this.channelId }).then(metadata => {
      // Override channel icon with customApps icons
      metadata.thumbnail = getChannelIcon(metadata);
      return metadata;
    });
  }

  getChannelFilterOptions() {
    return ChannelResource.fetchFilterOptions(this.channelId).then(response => {
      return {
        availableAuthors: response.data.available_authors,
        availableTags: response.data.available_tags,
        availableKinds: response.data.available_kinds,
      };
    });
  }

  navigateTo(nodeId) {
    showTopicsContentInLightbox(store, nodeId);
  }

  closeCustomPresentation() {
    const backPage = store.state.topicsTree.backFromCustomPage;
    router.push({
      name: backPage || PageNames.TOPICS_ROOT,
    });
  }

  getContentByFilter(options) {
    const { kinds, onlyContent, onlyTopics } = options;

    if (onlyContent && onlyTopics) {
      const err = new Error('onlyContent and onlyTopics can not be used at the same time');
      throw err;
    }
    const kind = onlyContent ? 'content' : onlyTopics ? ContentNodeKinds.TOPIC : undefined;

    return ContentNodeResource.fetchCollection({
      getParams: {
        ids: options.ids,
        authors: options.authors,
        tags: options.tags,
        channel_id: this.channelId,
        parent: options.parent === 'self' ? this.channelId : options.parent,
        max_results: options.maxResults ? options.maxResults : 50,
        kind: kind,
        kind_in: kinds,
        descendant_of: options.descendantOf,
        no_available_filtering: true,
      },
    }).then(contentNodes => {
      const { more, results } = contentNodes;

      return {
        maxResults: options.maxResults ? options.maxResults : 50,
        results,
        more,
      };
    });
  }

  getContentPage(options) {
    return ContentNodeResource.fetchCollection({
      getParams: options,
    }).then(contentNodes => {
      const { more, results } = contentNodes;

      return {
        maxResults: options.max_results ? options.max_results : 50,
        more,
        results,
      };
    });
  }

  getContentById(id, ignoreCache = false) {
    if (ignoreCache && id in ContentNodeResource.cache) {
      delete ContentNodeResource.cache[id];
    }
    return ContentNodeResource.fetchModel({ id: id });
  }

  searchContent(options) {
    let searchPromise;
    const { keyword, includeUnavailable } = options;
    if (!keyword) {
      searchPromise = Promise.resolve({
        page: 0,
        pageSize: 0,
        results: [],
      });
    } else {
      searchPromise = ContentNodeSearchResource.fetchCollection({
        getParams: {
          search: keyword,
          channel_id: this.channelId,
          ...(includeUnavailable && { no_available_filtering: true }),
        },
      });
    }

    return searchPromise;
  }

  getHighlightedContent(options) {
    const maxResults = options.maxResults ? options.maxResults : 10;
    const highlightedContentUrl = urls.static(`highlighted-content.json`);
    return (
      fetch(highlightedContentUrl)
        // Parse the JSON:
        .then(response => response.json())
        .catch(error => {
          console.error(error);
        })
        // Get the set of IDs using a rotation logic:
        .then(jsonData => {
          if (!(this.channelId in jsonData)) {
            throw new Error('NoHighlights');
          }
          const channelData = jsonData[this.channelId];

          // How many full sets?
          const setsNumber = Math.floor(channelData.length / maxResults);

          // Reduce day number to a valid index:
          const dayNumber = utils.getDayOfYearNumber();
          const i = dayNumber % setsNumber;

          // return jsonData[this.channelId].slice(0, maxResults);
          return channelData.slice(i * maxResults, i * maxResults + maxResults);
        })
        // Map IDs to content nodes:
        .then(ids => {
          return Promise.all(
            ids.map(id => {
              return this.getContentById(id)
                .then(node => {
                  return node;
                })
                .catch(() => {
                  return null;
                });
            })
          );
        })
        // Filter out the content not found:
        .then(nodes => {
          return {
            results: nodes.filter(n => n !== null),
          };
        })
    );
  }

  getRandomNodes(options) {
    return this.getHighlightedContent(options).catch(() => {
      return this.getRandomNodesReal(options);
    });
  }

  // This is the upstream API:
  getRandomNodesReal(options) {
    const { kinds, onlyContent } = options;

    return ContentNodeResource.fetchRandomCollection({
      getParams: {
        parent: options.parent === 'self' ? this.channelId : options.parent,
        channel_id: this.channelId,
        max_results: options.maxResults ? options.maxResults : 10,
        kind: onlyContent ? 'content' : undefined,
        kind_in: kinds,
        // Time seed to avoid cache
        seed: Date.now().toString(),
      },
    }).then(response => {
      return {
        maxResults: options.maxResults ? options.maxResults : 10,
        results: response.data,
      };
    });
  }

  checkContentDownload(...args) {
    return checkContentDownload(...args);
  }
  startContentDownload(...args) {
    return startContentDownload(...args);
  }
  retryContentDownload(...args) {
    return retryContentDownload(...args);
  }

  downloadChannel() {
    // TODO: this is a temporary workaround to the lack of
    // channel downloads. It merely redirects to the Devices
    // page.
    const deviceContentUrl = urls['kolibri:kolibri.plugins.device:device_management'];
    if (deviceContentUrl) {
      window.open(`${deviceContentUrl()}#/content`, '_self');
    }
  }

  get defaultHideUnavailable() {
    return DEFAULT_HIDE_UNAVAILABLE;
  }

  translate(nameSpace, defaultMessages, messageId, args) {
    // Create the translator and add it to the cache only if needed:
    let translator;
    // FIXME this would be more readable by using the nullish coalescing
    // assignment (??=) operator, but current linter is not happy:
    // TRANSLATORS[nameSpace] ??= createTranslator(nameSpace, defaultMessages);
    // const translator = TRANSLATORS[nameSpace];
    if (nameSpace in TRANSLATORS) {
      translator = TRANSLATORS[nameSpace];
    } else {
      translator = kolibriCreateTranslator(nameSpace, defaultMessages);
      TRANSLATORS[nameSpace] = translator;
    }
    return translator.$tr(messageId, args);
  }

  // This has to be called createTranslator() and have exactly the same arguments
  // and types as the createTranslator() function in kolibri.utils.i18n, otherwise
  // `kolibri-tools i18n-extract-messages` won’t detect it and extract the
  // original strings for translation.
  createTranslator(nameSpace, defaultMessages) {
    const translator = kolibriCreateTranslator(nameSpace, defaultMessages);
    TRANSLATORS[nameSpace] = translator;
    return translator;
  }
}

const kolibriApi = new KolibriApi();

export { KolibriApi, kolibriApi as default };
