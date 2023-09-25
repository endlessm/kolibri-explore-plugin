<template>
  <b-dropdown
    ref="dropdown"
    size="sm"
    class="mr-2"
    :text="filterNameToLabel(filter.prettyName, true)"
    :variant="filter.variant"
    :boundary="boundary"
  >
    <div class="d-flex filter-dropdown flex-column">
      <b-dropdown-header class="header">
        {{ filterNameToLabel(filter.name) }}
        <b-button-close @click="closeFilter()" />
      </b-dropdown-header>
      <b-dropdown-divider class="my-1" />
      <div class="filter-content flex-fill">
        <template v-if="isMediaFilter(filter)">
          <MediaFilterButtons :filter="filter" />
        </template>
        <template v-else>
          <b-button
            v-for="option in filter.options"
            :key="option"
            size="sm"
            pill
            class="mb-2 mr-2"
            :variant="buttonVariant(filter, option)"
            @click="onClick(filter, option)"
          >
            {{ option }}
          </b-button>
        </template>
      </div>
      <b-dropdown-divider class="my-1" />
      <b-dropdown-form class="flex-shrink-0">
        <b-button
          variant="link"
          size="sm"
          :disabled="clearDisabled(filter)"
          @click="clearFilter({ filter })"
        >
          <CloseIcon class="mr-1" />
          {{ $tr('clearAllButton') }}
        </b-button>
      </b-dropdown-form>
    </div>
  </b-dropdown>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { constants } from 'ek-components';
  import CloseIcon from 'vue-material-design-icons/CloseCircleOutline.vue';

  export default {
    name: 'FilterDropDown',
    components: {
      CloseIcon,
    },
    props: {
      filter: {
        type: Object,
        required: true,
      },
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
      filterNameToLabel(value, lowercase=false) {
        if (lowercase) {
          return constants.filterLabel(value).toLowerCase() || value;
        } else {
          return constants.filterLabel(value) || value;
        }
      },
    },
    $trs: {
      clearAllButton: {
        message: 'clear all',
        context: 'Label for a button to clear all media filters',
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

  .header {
    font-family: $headings-font-family;
  }

</style>
