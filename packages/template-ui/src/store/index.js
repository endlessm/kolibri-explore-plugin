import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';
import dynamicRequireAsset from '@/dynamicRequireAsset';
import { SEARCH_MAX_RESULTS } from '@/constants';
import { utils , constants as ComponentConstants } from 'eos-components';

import filters from './modules/filters';

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
  nodes: [],
  loading: true,

  // Navigation state:
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
  hasFilters: true,
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
    setNodes(state, payload) {
      const skipParsing = !state.isEndlessApp && state.bundleKind === null;
      const parsedNodes = (
        skipParsing ?
        payload.nodes
        :
        utils.parseNodes(payload.nodes, state.bundleKind !== null)
      );
      if (state.hasFlatGrid) {
        const rootNode = payload.nodes.find((n) => n.id === state.channel.id);
        const contentNodes = parsedNodes
          .filter((n) => n.kind !== 'topic')
          .map((n) => {
            n.parent = rootNode.id;
            n.ancestors = [rootNode];
            return n;
          });
        state.nodes = [rootNode, ...contentNodes];
      } else {
        state.nodes = parsedNodes;
      }
      state.loading = false;
    },
    setContentNavigation(state, payload) {
      state.content = state.nodes.find((n) => n.id === payload.contentId);
      state.section = state.content.ancestors[state.content.ancestors.length - 1];
      [, state.mainSection] = state.content.ancestors;
    },
    setSectionNavigation(state, payload) {
      const section = state.nodes.find((n) => n.id === payload.topicId);
      state.content = {};
      state.section = section;
      if (section.ancestors.length === 1) {
        state.mainSection = section;
      } else {
        [, state.mainSection] = section.ancestors;
      }
    },
    setHomeNavigation(state) {
      state.content = {};
      state.section = state.nodes.find((n) => n.id === state.channel.id);
      state.mainSection = {};
    },
  },
  getters: {
    getChildren: (state) => (node) => {
      return state.nodes.filter((n) => n.parent === node.id);
    },
    flattenNodes: (_state, getters) => (node) => {
      const childrenNodes = getters.getChildren(node).flatMap(getters.flattenNodes);
      return [node, ...childrenNodes];
    },
    recursiveExistsNodes: (_state, getters) => (node, fn) => {
      if (fn(node)) {
        return true;
      }
      const children = getters.getChildren(node);
      if (children.length) {
        return children.some((leaf) => getters.recursiveExistsNodes(leaf, fn));
      }
      return false;
    },
    mainSections: (state) => {
      return state.nodes.filter((n) => n.parent === state.channel.id && n.kind === 'topic');
    },
    headerTitle: (state) => {
      if (_.isEmpty(state.section) || state.section.id === state.channel.id) {
        return state.channel.title;
      }
      return state.section.title;
    },
    headerDescription: (state) => {
      if (_.isEmpty(state.section) || state.section.id === state.channel.id) {
        return state.channel.description;
      }
      return state.section.description;
    },
    getAsset: (state) => (name) => dynamicRequireAsset(state.assetFilenames[name]),
    getAssetURL: (_state, getters) => (name) => {
      const asset = getters.getAsset(name);
      return asset ? `url(${asset})` : null;
    },
    isInlineLevel: (state, getters) => getters.getChildren(state.section).every((n) => n.kind === 'topic'),
    isSimpleBundle: (state) => state.bundleKind === 'simple',
    showAsBundle: (state, getters) => (node) => {
      if (state.bundleKind === null || node.kind !== 'topic') {
        return false;
      }
      const hasChildTopics = getters.getChildren(node).some((n) => n.kind === 'topic');
      return !hasChildTopics;
    },
    getLevel: () => (node) => node.ancestors.length,
    getParentNode: (state) => (node) => {
      if (node.ancestors.length) {
        const parentId = node.ancestors[node.ancestors.length - 1].id;
        return state.nodes.find((n) => n.id === parentId);
      }
      return null;
    },
    nextNodesInTopic: (state) => {
      const currentOrder = state.content.sort_order;
      return state.nodes.filter((n) => (
        n.parent === state.section.id &&
        n.sort_order > currentOrder));
    },
    searchNodes: (state) => (query) => {
      // Trim whitespace and ignore case:
      const regexp = new RegExp(query, 'i');
      return state.nodes
        // Discard the channel node:
        .filter((node) => node.id !== state.channel.id)
        // Score the nodes according to how much their metadata matches the query:
        .map((node) => {
          let score = 0;
          if (regexp.test(node.title)) {
            score += 10;
          }
          if (regexp.test(node.author)) {
            score += 5;
          }
          if ('structuredTags' in node) {
            Object.values(node.structuredTags).forEach((tags) => {
              if (tags.some((t) => regexp.test(t))) {
                score += 5;
              }
            });
          }
          if (regexp.test(node.description)) {
            score += 1;
          }
          return [node, score];
        })
        // Remove non matching nodes:
        .filter(([, score]) => score !== 0)
        // Sort by score:
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        // At most N results:
        .slice(0, SEARCH_MAX_RESULTS)
        .map(([node]) => node);
    },
  },
  modules: {
    filters,
  },
});

export default store;
