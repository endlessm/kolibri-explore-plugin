<template>
  <EOSContainer v-if="availableFilters.length" class="my-5">
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
  </EOSContainer>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'FilterContent',
  computed: {
    ...mapState(['filters', 'section']),
    ...mapGetters({
      name: 'filters/name',
      isFiltering: 'filters/isFiltering',
      isEmpty: 'filters/isEmpty',
      possibleOptions: 'filters/possibleOptions',
    }),
    availableFilters() {
      return this.filters.metadata.map((f) => (
        {
          ...f,
          prettyName: this.name(f),
          variant: this.isFiltering(f) ? 'primary' : 'outline-dark',
          options: this.possibleOptions(f, this.section),
        }
      )).filter((f) => f.options.length > 1);
    },
  },
  mounted() {
    this.clearFilter({});
  },
  methods: {
    ...mapMutations({
      clearFilter: 'filters/clearFilterQuery',
    }),
  },
};
</script>
