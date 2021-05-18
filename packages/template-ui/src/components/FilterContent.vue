<template>
  <b-container class="my-4" v-if="availableFilters.length">
    <span class="mr-4">Filter By</span>
    <b-dropdown
      class="mr-2"
      v-for="filter in availableFilters"
      :key="filter.name"
      :text="filter.prettyName"
      :variant="filter.variant"
    >

      <b-dropdown-group :header="filter.name">
        <b-dropdown-form
          v-for="option in filter.options"
          :key="option"
        >
          <b-form-checkbox
            :checked="isSelected(filter, option)"
            @change="onOptionClick({filter, option, checked: arguments[0]})"
          >
            {{ option }}
          </b-form-checkbox>
        </b-dropdown-form>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-form>
          <b-button variant="link" @click="clearFilter({filter})">Clear</b-button>
        </b-dropdown-form>
      </b-dropdown-group>
    </b-dropdown>
    <b-button
      variant="link"
      @click="clearFilter({})"
      v-if="!isEmpty"
    >
      clear filters
    </b-button>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['filters', 'section']),
    ...mapGetters({
      name: 'filters/name',
      isFiltering: 'filters/isFiltering',
      isEmpty: 'filters/isEmpty',
      isSelected: 'filters/isSelected',
      possibleOptions: 'filters/possibleOptions',
    }),
    availableFilters() {
      return this.filters.metadata.map((f) => (
        {
          ...f,
          prettyName: this.name(f),
          variant: this.isFiltering(f) ? 'primary' : 'outline-secondary',
          options: this.possibleOptions(f, this.section),
        }
      )).filter((f) => f.options.length > 1);
    },
  },
  methods: {
    ...mapMutations({
      onOptionClick: 'filters/setFilterQuery',
      clearFilter: 'filters/clearFilterQuery',
    }),
  },
  mounted() {
    this.clearFilter({});
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.b-dropdown {
  ::v-deep .dropdown-toggle {
    border-radius: $rounded-pill;
  }
}
</style>
