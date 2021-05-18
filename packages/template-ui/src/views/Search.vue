<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot />
    <div class="search-row">
      <b-container class="py-4">
        <b-input-group>
          <template #prepend>
            <b-input-group-text>
              <b-icon-search />
            </b-input-group-text>
          </template>
          <template #append>
            <b-button pill variant="link" to="/">
              <b-icon-x />
            </b-button>
          </template>
          <b-form-input
            placeholder="What do you want to learn about?"
            v-model="query"
            ref="searchInput"
          />
        </b-input-group>
      </b-container>
    </div>

    <b-container
      v-if="notFound"
    >
     <h3>We can't find any content that matches your search.</h3>
     <p class="lead">You can try to use fewer words or browse by topics.</p>
    </b-container>

    <CardGrid
      v-if="!resultNodes.length"
      :nodes="mainSections"
    >
      <h3>Explore topics</h3>
    </CardGrid>
    <CardGrid
      v-else
      :nodes="resultNodes"
      variant="paginated"
    >
      <h3>Results</h3>
    </CardGrid>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'underscore';

// Escapes the RegExp special characters in string.
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  name: 'Search',
  data() {
    return {
      query: '',
      resultNodes: [],
      searching: false,
    };
  },
  computed: {
    ...mapGetters(['mainSections', 'getAssetURL', 'searchNodes']),
    backgroundImageURL() {
      return this.getAssetURL('homeBackgroundImage');
    },
    notFound() {
      return !this.searching && !this.resultNodes.length && this.query !== '';
    },
    cleanedQuery() {
      return escapeRegExp(this.query.trim());
    },
  },
  watch: {
    cleanedQuery() {
      if (this.cleanedQuery === '') {
        this.searching = false;
        this.resultNodes = [];
        return;
      }
      this.searching = true;
      this.debouncedSearch();
    },
  },
  created() {
    this.debouncedSearch = _.debounce(this.search, 500);
  },
  mounted() {
    this.focusSearchInput();
  },
  methods: {
    search() {
      this.resultNodes = this.searchNodes(this.cleanedQuery);
      this.searching = false;
    },
    focusSearchInput() {
      this.$refs.searchInput.$el.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.form-control {
  background-color: transparent;
  border: none;
  &:active, &:focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
}

.input-group-text {
  border: none;
}

.search-row {
  background-color: $gray-200;
  margin-bottom: $jumbotron-padding;
  box-shadow: $btn-active-box-shadow;
}

</style>
