import { constants } from 'ek-components';

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
  return constants.mediaTypeVerb(value) || value;
}

const {
  AuthorFilterName,
  MediaFilterName,
  TagFilterName,
} = constants;

const structuredTagsMetadata = Object.values(constants.StructuredTags)
  .filter((t) => !constants.FilterTagsBadList.includes(t))
  .map((t) => ({ name: t }));

// Filter taxonomy, that can be overriden
const initialState = {
  filterOptions: {},
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
  },
  mutations: {
    setFilterOptions(state, payload) {
      state.filterOptions = payload;
    },
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
