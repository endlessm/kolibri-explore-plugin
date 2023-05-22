import Vue from 'vue';
import Vuex from 'vuex';
import { constants as ComponentConstants } from 'ek-components';

import filters from './modules/filters';
import dynamicRequireAsset from '@/dynamicRequireAsset';

let storeData;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  storeData = require('@/overrides/options.json');
} catch (e) {
  storeData = {};
}

Vue.use(Vuex);

const initialState = {
  // Channel and nodes, as they come from kolibri:
  channel: {},
  mainSections: [],
  searchQuery: '',

  isStandaloneChannel: false,

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
  carouselNodeIds: [], // if empty we'll fetch nodes from the API
  carouselSlideNumber: 3, // Only used if fetching nodes, defaults to 3
  carouselKinds: [], // Array of content kinds. If empty any kinds will be fetched.

  mediaQuality: ComponentConstants.MediaQuality.REGULAR,
  displayLogoInHeader: true,
  hasDarkHeader: false,
  hasSectionsSearch: true,
  hasCarousel: true,
  hasFilters: true,
  hasFlatGrid: false,
  defaultContentNode: null,
  isEndlessApp: false,
  bundleKind: null,
  showFooter: true,
  showNextContent: true,
  showDetailViewFullScreen: false,
  showParentsInBreadcrumb: true,
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
    setSearchQuery(state, payload) {
      state.searchQuery = payload;
    },
  },
  getters: {
    getAsset: (state) => (name) => dynamicRequireAsset(state.assetFilenames[name]),
    getAssetURL: (_state, getters) => (name) => {
      const asset = getters.getAsset(name);
      return asset ? `url(${asset})` : null;
    },
    isSimpleBundle: (state) => state.bundleKind === 'simple',
  },
  modules: {
    filters,
  },
});

export default store;
