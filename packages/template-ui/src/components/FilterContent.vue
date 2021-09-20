<template>
  <b-container v-if="availableFilters.length" class="my-5">
    <span class="mr-4">Filter By</span>

    <FilterDropDown
      v-for="filter in availableFilters"
      :key="filter.name"
      :filter="filter"
    />
    <b-button
      v-if="!isEmpty"
      variant="link"
      @click="clearFilter({})"
    >
      clear filters
    </b-button>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { constants } from 'eos-components';

export default {
  name: 'FilterContent',
  computed: {
    ...mapState(['filters', 'isEndlessApp', 'section']),
    ...mapGetters({
      name: 'filters/name',
      isFiltering: 'filters/isFiltering',
      isEmpty: 'filters/isEmpty',
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
      if (Object.values(constants.StructuredTags).includes(filter.name)) {
        if (!this.isEndlessApp || !this.options.availableTags) {
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
          const { availableActivityTypes } = this.options;
          return this.sortOptionsByWeight(availableActivityTypes)
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
      return constants.MediaTypeVerbs[value] || value;
    },
    sortOptionsByWeight(weightedOptions) {
      return Object.keys(weightedOptions).sort((a, b) => weightedOptions[b] - weightedOptions[a]);
    }
  },
};
</script>
