import { recursiveExistsNodes, flattenNodes } from '@/utils';
import _ from 'underscore';

import { constants } from 'eos-components';

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
    .filter((n) => n.kind !== 'topic')
    .map((n) => n.author)
    .filter((n) => n !== '');
}

function getTagOptions(node) {
  return flattenNodes(node)
    .flatMap((n) => (n.tags ? n.tags : []))
    .filter((n) => n.kind !== 'topic')
    .filter((t) => t !== '')
    .filter((t) => !t.match(constants.StructuredTagsRegExp));
}

function getStructuredTagOptions(node, matchKey) {
  return flattenNodes(node)
    .filter((n) => n.kind !== 'topic')
    .flatMap((n) => n.structuredTags[matchKey]);
}

let storeData;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  const data = require('@/overrides/options.json');
  if (data.filters) {
    storeData = data.filters;
  }
} catch (e) {
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
  'zim',
];

function contentKindToVerb(value) {
  return constants.MediaTypeVerbs[value] || value;
}

const MediaFilterName = 'Learning activity';
const AuthorFilterName = 'author';
const TagFilterName = 'common keywords';

const structuredTagsMetadata = Object.values(constants.StructuredTags)
  .filter((t) => !constants.FilterTagsBadList.includes(t))
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
    isMediaFilter: () => (filter) => {
      return filter.name === MediaFilterName;
    },
    getFilterOptions: (state) => (filter) => (
      state.query[filter.name] || []
    ),
    name: (_state, getters) => (filter) => {
      const selectedFilters = getters.getFilterOptions(filter);
      const count = selectedFilters.length;
      if (count === 0) {
        return filter.name;
      }

      let [first] = selectedFilters;
      if (getters.isMediaFilter(filter)) {
        first = contentKindToVerb(first);
      }

      if (count === 1) {
        return first;
      }

      return `${first} +${count - 1}`;
    },
    isFiltering: (_state, getters) => (filter) => (
      getters.getFilterOptions(filter).length > 0
    ),
    isSelected: (_state, getters) => (filter, option) => {
      const selectedFilters = getters.getFilterOptions(filter);
      return selectedFilters.includes(option);
    },
    filterNodes: (state, getters) => (nodes) => {
      // Empty filter
      if (getters.isEmpty) {
        return nodes;
      }

      const { query } = state;
      let filtered = nodes || [];

      // Get all leaf nodes
      filtered = filtered
        .map((n) => flattenNodes(n))
        .reduce((accumulator, item) => accumulator.concat(item), [])
        .filter((n) => n.kind !== 'topic');

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
      Object.values(constants.StructuredTags).forEach((matchKey) => {
        const options = query[matchKey];
        if (options && options.length) {
          filtered = filtered.filter((node) => (
            options.some((o) => recursiveExistsNodes(node,
              (n) => matchKey in n.structuredTags && n.structuredTags[matchKey].includes(o)))
          ));
        }
      });

      return filtered;
    },
    possibleOptions: () => (filter, root) => {
      if (Object.values(constants.StructuredTags).includes(filter.name)) {
        const getOptionsFunc = _.partial(getStructuredTagOptions, _, filter.name);
        return sortOptionsByWeight(root, getOptionsFunc);
      }
      switch (filter.name) {
        case MediaFilterName:
          return filter.options
            .filter((m) => recursiveExistsNodes(root, (n) => n.kind === m))
            .map((k) => ({
              kind: k,
              label: contentKindToVerb(k),
            }));
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
