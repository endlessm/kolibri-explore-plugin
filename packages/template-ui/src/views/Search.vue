<template>
  <div
    class="root"
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <SearchBar v-model="query" @clear-input="onClearInput" />

    <EmptyResultsMessage v-if="notFound" :showTopics="false">
      <h1 class="text-secondary">
        Sorry, we can’t find any content that matches your search.
      </h1>
      <h5 class="text-muted">
        You can try a different search, maybe use fewer words, or try one
        of the topic suggestions below.
      </h5>
    </EmptyResultsMessage>

    <CardGrid
      v-if="!resultNodes.length"
      :nodes="mainSections"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    >
      <h3>Explore topics</h3>
    </CardGrid>
    <CardGrid
      v-else
      :nodes="resultNodes"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
      variant="collapsible"
    >
      <h3>Results</h3>
    </CardGrid>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

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
    ...mapGetters(['getAssetURL']),
    ...mapState(['mainSections', 'cardColumns', 'mediaQuality']),
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
      return window.kolibri.searchContent({ keyword: this.cleanedQuery })
        .then((page) => {
          this.resultNodes = page.results;
          this.searching = false;
        });
    },
    onClearInput() {
      this.query = '';
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
