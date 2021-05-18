import { recursiveExistsNodes, flattenNodes } from '@/utils';
import { StructuredTags } from '@/constants';
import _ from 'underscore';

const StructuredTagsRegExp = new RegExp('(.*)=(.*)');

// ['foo', 'foo', 'bar'] => { 'foo': 2, 'bar': 1 }
function weightOptions(options) {
  return options.reduce((weighted, option) => ({
    ...weighted,
    [option]: (weighted[option] || 0) + 1,
  }), {});
}

function sortOptionsByWeight(root, getOptionsFunc) {
  const weightedOptions = weightOptions(getOptionsFunc(root));
  return Object.keys(weightedOptions).sort((a, b) => weightedOptions[b] - weightedOptions[a]);
}

function getAuthorOptions(node) {
  return flattenNodes(node)
    .map((n) => n.author)
    .filter((n) => n !== '');
}

function getTagOptions(node) {
  return flattenNodes(node)
    .flatMap((n) => (n.tags ? n.tags : []))
    .filter((t) => t !== '')
    .filter((t) => !t.match(StructuredTagsRegExp));
}

function getStructuredTags(node, matchKey) {
  if (!node.tags) {
    return [];
  }
  const tagValues = node.tags
    .filter((t) => t.match(StructuredTagsRegExp))
    .map((t) => t.match(StructuredTagsRegExp))
    .filter(([, key]) => key === matchKey)
    .map(([,, value]) => value);
  return tagValues;
}

function getStructuredTagOptions(node, matchKey) {
  return flattenNodes(node)
    .flatMap((n) => getStructuredTags(n, matchKey));
}

let storeData;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  const data = require('@/overrides/options.json');
  if (data.filters) {
    storeData = data.filters;
  }
} catch {
  storeData = {};
}

// All the media types are defined in kolibri, this list is a subset of all the
// possible content node kinds defined here:
// https://github.com/learningequality/kolibri/blob/release-v0.14.x/kolibri/core/assets/src/constants.js#L17
const ContentNodeKinds = [
  'audio',
  'document',
  'video',
  'exercise',
  'html5',
  'exam',
  'lesson',
  'slideshow',
];

const MediaFilterName = 'media type';
const AuthorFilterName = 'author';
const TagFilterName = 'common keywords';

const structuredTagsMetadata = Object.values(StructuredTags)
  .map((t) => ({ name: t }));

// Filter taxonomy, that can be overriden
const initialState = {
  // Object with all filters selected
  // key -> filter name
  // value -> array with all the selected options
  query: {},
  metadata: [
    ...structuredTagsMetadata,
    {
      name: AuthorFilterName,
    },
    {
      name: MediaFilterName,
      options: ContentNodeKinds,
    },
    {
      name: TagFilterName,
      maxTags: 10,
    },
  ],
};

export default {
  namespaced: true,
  state: { ...initialState, ...storeData },
  getters: {
    isEmpty: (state) => {
      if (Object.keys(state.query).length === 0) {
        return true;
      }

      return !Object.keys(state.query).some((k) => state.query[k].length > 0);
    },
    getFilterOptions: (state) => (filter) => (
      state.query[filter.name] || []
    ),
    name: (_state, getters) => (filter) => {
      const selectedFilters = getters.getFilterOptions(filter);
      if (selectedFilters.length === 1) {
        return selectedFilters[0];
      }
      return filter.name;
    },
    isFiltering: (_state, getters) => (filter) => (
      getters.getFilterOptions(filter).length > 0
    ),
    isSelected: (_state, getters) => (filter, option) => {
      const selectedFilters = getters.getFilterOptions(filter);
      return selectedFilters.includes(option);
    },
    filterNodes: (state) => (nodes) => {
      const { query } = state;
      let filtered = nodes;

      // Filter by media type
      const mediaType = query[MediaFilterName];
      if (mediaType && mediaType.length) {
        filtered = filtered.filter((node) => (
          mediaType.some((m) => recursiveExistsNodes(node, (n) => n.kind === m))
        ));
      }
      // Filter by author
      const authors = query[AuthorFilterName];
      if (authors && authors.length) {
        filtered = filtered.filter((node) => (
          authors.some((a) => recursiveExistsNodes(node, (n) => n.author === a))
        ));
      }
      // Filter by tag
      const tags = query[TagFilterName];
      if (tags && tags.length) {
        filtered = filtered.filter((node) => (
          tags.some((t) => recursiveExistsNodes(node, (n) => n.tags && n.tags.includes(t)))
        ));
      }
      // Filter by structured tags
      Object.values(StructuredTags).forEach((matchKey) => {
        const options = query[matchKey];
        if (options && options.length) {
          filtered = filtered.filter((node) => (
            options.some((o) => recursiveExistsNodes(node,
              (n) => getStructuredTags(n, matchKey).includes(o)))
          ));
        }
      });

      return filtered;
    },
    possibleOptions: () => (filter, root) => {
      if (Object.values(StructuredTags).includes(filter.name)) {
        const getOptionsFunc = _.partial(getStructuredTagOptions, _, filter.name);
        return sortOptionsByWeight(root, getOptionsFunc);
      }
      switch (filter.name) {
        case MediaFilterName:
          return filter.options.filter((m) => recursiveExistsNodes(root, (n) => n.kind === m));
        case AuthorFilterName:
          return sortOptionsByWeight(root, getAuthorOptions);
        case TagFilterName: {
          const { maxTags } = filter;
          return sortOptionsByWeight(root, getTagOptions)
            .slice(0, maxTags);
        }
        default:
          return filter.options;
      }
    },
    getStructuredTags: () => (node, matchKey) => (getStructuredTags(node, matchKey)),
    getFirstStructuredTag: (_state, getters) => (node, matchKey) => {
      const tags = getters.getStructuredTags(node, matchKey);
      if (!tags.length) {
        return null;
      }
      return tags[0];
    },
  },
  mutations: {
    setFilterQuery(state, payload) {
      const { filter, checked, option } = payload;
      const query = state.query || {};
      const selectedFilters = query[filter.name] || [];

      if (checked) {
        selectedFilters.push(option);
      } else {
        selectedFilters.splice(selectedFilters.indexOf(option), 1);
      }

      state.query = { ...query, [filter.name]: selectedFilters };
    },
    clearFilterQuery(state, payload) {
      const { filter } = payload;
      const query = state.query || {};
      let newQuery = {};
      if (filter) {
        newQuery = { ...query, [filter.name]: [] };
      }
      state.query = newQuery;
    },
  },
};
