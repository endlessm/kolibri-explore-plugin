import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';
import dynamicRequireAsset from '@/dynamicRequireAsset';
import { constants as ComponentConstants } from 'eos-components';

import filters from './modules/filters';

let storeData;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  storeData = require('@/overrides/options.json');
} catch (e) {
  storeData = {};
}

Vue.use(Vuex);

function findNodeById(node, nodeId) {
  if (node.id === nodeId) {
    return node;
  }
  if (!node.children) {
    return null;
  }
  let result = null;
  node.children.some((n) => {
    result = findNodeById(n, nodeId);
    return result;
  });
  return result;
}

const initialState = {
  // Channel and nodes, as they come from kolibri:
  channel: {},
  mainSections: [],

  // FIXME: remove old state:
  nodes: [],
  tree: {},

  isStandaloneChannel: false,

  // FIXME: remove old navigation state:
  content: {},
  section: {},
  mainSection: {},

  // Asset filenames that can be overriden:
  assetFilenames: {
    defaultThumbnail: 'default-card-thumbnail.svg',
    homeBackgroundImage: 'home-background.jpg',
    sectionBackgroundImage: 'section-background.jpg',
    headerImage: 'header-background.jpg',
    footerImage: 'footer-background.jpg',
  },

  // Layout:
  cardColumns: {
    cols: 6,
    md: 4,
    lg: 3,
  },

  // Carousel config:
  carouselNodeIds: [], // if empty we'll pick nodes randomly
  carouselSlideNumber: 3, // Only used if picking randomly, defaults to 3

  mediaQuality: ComponentConstants.MediaQuality.REGULAR,
  displayLogoInHeader: true,
  hasDarkHeader: false,
  hasSectionsSearch: true,
  hasCarousel: true,
  // FIXME reenable the filters and migrate them to the API:
  hasFilters: false,
  hasFlatGrid: false,
  displayHeroContent: false,
  isEndlessApp: false,
  bundleKind: null,
};

const store = new Vuex.Store({
  state: { ...initialState, ...storeData },
  mutations: {
    setChannelInformation(state, payload) {
      state.channel = payload.channel;
    },
    setMainSections(state, payload) {
      state.mainSections = payload.mainSections;
    },
    setIsStandaloneChannel(state) {
      state.isStandaloneChannel = true;
    },
  },
  getters: {
    headerTitle: (state) => {
      if (_.isEmpty(state.section) || state.section.id === state.channel.id) {
        return state.channel.title;
      }
      return state.section.title;
    },
    headerDescription: (state) => {
      if (_.isEmpty(state.section)) {
        return state.channel.description;
      }
      if (state.section === state.tree[0]) {
        return state.channel.description;
      }
      return state.section.description;
    },
    getAsset: (state) => (name) => dynamicRequireAsset(state.assetFilenames[name]),
    getAssetURL: (_state, getters) => (name) => {
      const asset = getters.getAsset(name);
      return asset ? `url(${asset})` : null;
    },
    isSimpleBundle: (state) => state.bundleKind === 'simple',
    getLevel: () => (node) => node.ancestors.length,
    getParentNode: (state) => (node) => {
      if (node.ancestors.length) {
        const parentId = node.ancestors[node.ancestors.length - 1].id;
        return findNodeById(state.tree[0], parentId);
      }
      return null;
    },
  },
  modules: {
    filters,
  },
});

export default store;
