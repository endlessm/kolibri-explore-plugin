<template>
  <b-dropdown
    ref="dropdown"
    class="mr-2"
    :text="filter.prettyName"
    :variant="filter.variant"
    :boundary="boundary"
  >
    <div class="d-flex filter-dropdown flex-column">
      <b-dropdown-header>
        {{ filter.name }}
        <b-button-close @click="closeFilter()" />
      </b-dropdown-header>
      <b-dropdown-divider class="my-1" />
      <div class="filter-content flex-fill">
        <template v-if="isMediaFilter(filter)">
          <PlayButton
            v-for="option in filter.options"
            :key="option.kind"
            class="mb-2 mr-2"
            :kind="option.kind"
            :label="option.label"
            :variant="buttonVariant(filter, option.kind)"
            @click="onClick(filter, option)"
          />
        </template>
        <template v-else>
          <b-btn
            v-for="option in filter.options"
            :key="option"
            pill
            class="mb-2 mr-2"
            :variant="buttonVariant(filter, option)"
            @click="onClick(filter, option)"
          >
            {{ option }}
          </b-btn>
        </template>
      </div>
      <b-dropdown-divider class="my-1" />
      <b-dropdown-form class="flex-shrink-0">
        <b-button
          variant="link"
          :disabled="clearDisabled(filter)"
          @click="clearFilter({ filter })"
        >
          <b-icon-x-circle class="mr-1" />
          clear all
        </b-button>
      </b-dropdown-form>
    </div>
  </b-dropdown>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'FilterDropDown',
    props: {
      filter: Object,
    },
    computed: {
      ...mapGetters({
        isSelected: 'filters/isSelected',
        isFiltering: 'filters/isFiltering',
        isMediaFilter: 'filters/isMediaFilter',
      }),
      boundary() {
        return document.body;
      },
    },
    methods: {
      ...mapMutations({
        onOptionClick: 'filters/setFilterQuery',
        clearFilter: 'filters/clearFilterQuery',
      }),
      buttonVariant(filter, option) {
        return this.isSelected(filter, option) ? 'primary' : 'light';
      },
      closeFilter() {
        this.$refs.dropdown.hide(true);
      },
      clearDisabled(filter) {
        return !this.isFiltering(filter);
      },
      onClick(filter, option) {
        if (this.isMediaFilter(this.filter)) {
          const selected = this.isSelected(filter, option.kind);
          this.onOptionClick({ filter, option: option.kind, checked: !selected });
          return;
        }

        const selected = this.isSelected(filter, option);
        this.onOptionClick({ filter, option, checked: !selected });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/styles.scss';

  .filter-dropdown {
    max-height: 30rem;
    background-color: $white;
  }

  @include media-breakpoint-up(md) {
    .filter-dropdown {
      max-width: map-get($container-max-widths, 'md');
    }
  }

  @include media-breakpoint-only(md) {
    .filter-dropdown {
      max-width: map-get($container-max-widths, 'sm');
    }
  }

  .filter-content {
    overflow-y: auto;
    padding: $dropdown-item-padding-y $dropdown-item-padding-x;
  }

  .b-dropdown {
    ::v-deep .dropdown-toggle {
      border-radius: $rounded-pill;
    }
  }

</style>
