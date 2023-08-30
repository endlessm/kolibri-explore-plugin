<template>
  <b-container v-if="availableFilters.length" class="my-5">
    <MediaFilterButtons v-if="flatMediaFilter" variant="flat" size="sm" :filter="mediaFilter" />
    <FilterDropDown
      v-for="filter in dropdownFilters"
      :key="filter.name"
      :filter="filter"
    />
    <b-button
      v-if="!isEmpty"
      size="sm"
      variant="link"
      @click="clearFilter({})"
    >
      {{ $tr('clearFiltersButton') }}
    </b-button>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { constants } from 'ek-components';

export default {
  name: 'FilterContent',
  computed: {
    ...mapState(['filters', 'isEndlessApp', 'section']),
    ...mapGetters({
      name: 'filters/name',
      isFiltering: 'filters/isFiltering',
      isEmpty: 'filters/isEmpty',
      isMediaFilter: 'filters/isMediaFilter',
    }),
    options() {
      return this.filters.filterOptions;
    },
    availableFilters() {
      return this.filters.metadata.map((f) => (
        {
          ...f,
          prettyName: this.name(f),
          variant: this.isFiltering(f) ? 'primary' : 'outline-dark',
          options: this.possibleOptions(f),
        }
      )).filter((f) => f.options.length > 1);
    },
    dropdownFilters() {
      if (this.flatMediaFilter) {
        return this.availableFilters.filter((f) => !this.isMediaFilter(f));
      }

      return this.availableFilters;
    },
    mediaFilter() {
      const [filter] = this.availableFilters.filter((f) => this.isMediaFilter(f));
      return filter;
    },
    flatMediaFilter() {
      return this.mediaFilter && this.mediaFilter.options.length < 4;
    },
  },
  watch: {
    section() {
      this.clearFilter({});
    },
  },
  mounted() {
    this.clearFilter({});
  },
  methods: {
    ...mapMutations({
      clearFilter: 'filters/clearFilterQuery',
    }),
    possibleOptions(filter) {
      // this will be superceeded by the new taxonomy being tested in
      // https://phabricator.endlessm.com/T32647
      if (this.isEndlessApp && Object.values(constants.StructuredTags).includes(filter.name)) {
        if (!this.options.availableTags) {
          return [];
        }

        const tags = this.sortOptionsByWeight(this.options.availableTags);
        const structuredTags = {};

        Object.values(constants.StructuredTags).forEach((matchKey) => {
          const tagValues = tags
            .filter((t) => t.match(constants.StructuredTagsRegExp))
            .map((t) => t.match(constants.StructuredTagsRegExp))
            .filter(([, key]) => key === matchKey)
            .map(([,, value]) => value);
          structuredTags[matchKey] = tagValues;
        });

        return structuredTags[filter.name];
      }

      switch (filter.name) {
        // Media type filter, all content kinds
        case constants.MediaFilterName: {
          const { availableKinds } = this.options;
          return this.sortOptionsByWeight(availableKinds)
            .filter((k) => k !== 'topic')
            .map((k) => ({
              kind: k,
              label: this.contentKindToVerb(k),
            }));
        }

        // Author filtering
        case constants.AuthorFilterName: {
          const { availableAuthors } = this.options;
          if (!availableAuthors) {
            return [];
          }
          return this.sortOptionsByWeight(availableAuthors);
        }

        // Tags filtering
        case constants.TagFilterName: {
          const { availableTags } = this.options;
          if (!availableTags) {
            return [];
          }
          const tags = this.sortOptionsByWeight(availableTags);
          const { maxTags } = filter;
          return tags
            .filter((t) => !t.match(constants.StructuredTagsRegExp))
            .slice(0, maxTags);
        }

        default:
          return filter.options || [];
      }
    },
    contentKindToVerb(value) {
      return constants.mediaTypeVerb(value) || value;
    },
    sortOptionsByWeight(weightedOptions) {
      return Object.keys(weightedOptions).sort((a, b) => weightedOptions[b] - weightedOptions[a]);
    }
  },
  $trs: {
    clearFiltersButton: {
      message: 'clear filters',
      context: 'Label for a button to clear media filters',
    },
  },
};
</script>
