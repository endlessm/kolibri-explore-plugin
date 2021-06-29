import Vue from 'vue';
import Vuex from 'vuex';
import { getNodesTree } from '@/utils';
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
  nodes: [],
  tree: {},
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
  isEndlessApp: false,
  bundleKind: null,
};

const store = new Vuex.Store({
  state: { ...initialState, ...storeData },
  mutations: {
    setChannelInformation(state, payload) {
      state.channel = payload.channel;
      state.nodes = utils.parseNodes(payload.nodes, state.bundleKind !== null);
      state.tree = getNodesTree(payload.nodes);
      state.loading = false;
    },
    setContentNavigation(state, payload) {
      state.content = state.nodes.find((n) => n.id === payload.contentId);
      state.section = state.content.ancestors[state.content.ancestors.length - 1];
      [, state.mainSection] = state.content.ancestors;
    },
    setSectionNavigation(state, payload) {
      const section = findNodeById(state.tree[0], payload.topicId);
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
      [state.section] = state.tree;
      state.mainSection = {};
    },
  },
  getters: {
    mainSections: (state) => {
      if (state.tree[0]) {
        return state.tree[0].children.filter((n) => n.kind === 'topic');
      }
      return [];
    },
    headerDescription: (state) => {
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
    isInlineLevel: (state) => state.section.children.every((n) => n.kind === 'topic'),
    isSimpleBundle: (state) => state.bundleKind === 'simple',
    showAsBundle: (state) => (node) => {
      if (state.bundleKind === null || node.kind !== 'topic') {
        return false;
      }
      const hasChildTopics = node.children.some((n) => n.kind === 'topic');
      return !hasChildTopics;
    },
    getLevel: () => (node) => node.ancestors.length,
    getParentNode: (state) => (node) => {
      if (node.ancestors.length) {
        const parentId = node.ancestors[node.ancestors.length - 1].id;
        return findNodeById(state.tree[0], parentId);
      }
      return null;
    },
    nextNodesInTopic: (state) => {
      const currentOrder = state.content.sort_order;
      const parent = findNodeById(state.tree[0], state.section.id);
      return parent.children.filter((node) => node.sort_order > currentOrder);
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
          Object.values(node.structuredTags).forEach((tags) => {
            if (tags.some((t) => regexp.test(t))) {
              score += 5;
            }
          });
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
        .map(([node]) => node)
        // Map topics to tree nodes, otherwise they won't have children:
        .map((node) => {
          if (node.kind !== 'topic') {
            return node;
          }
          return findNodeById(state.tree[0], node.id);
        });
    },
  },
  modules: {
    filters,
  },
});

export default store;
