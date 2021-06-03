<template>
  <div
    class="root"
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <SearchBar v-model="query" closeLinkTo="/" />

    <b-container
      v-if="notFound"
    >
      <h3>We can't find any content that matches your search.</h3>
      <p class="lead">
        You can try to use fewer words or browse by topics.
      </p>
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
      return !this.searching && !this.resultNodes.length && this.cleanedQuery !== '';
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
      this.search();
    },
  },
  methods: {
    search() {
      this.resultNodes = this.searchNodes(this.cleanedQuery);
      this.searching = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.root {
  margin-top: $navbar-height;
}

</style>
