<template>
  <div
    class="root"
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <ChannelNavBar />
    <EkSearchBar
      v-model="query"
      @clear-input="onClearInput"
    />

    <b-container>
      <b-row alignH="between">
        <b-col>
          <b-form-checkbox v-model="hideUnavailable" name="check-hide-unavailable" switch>
            {{ $tr('onlyDownloadedItems') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
    </b-container>

    <EmptyResultsMessage v-if="notFound" :showTopics="false">
      <h1 class="text-secondary">
        {{ $tr('noContentFound') }}
      </h1>
      <h5 class="text-muted">
        {{ $tr('noContentFoundGuidance') }}
      </h5>
    </EmptyResultsMessage>

    <EkCardGrid
      v-if="!resultNodes.length"
      :nodes="mainSections"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    >
      <b-row>
        <b-container>
          <h4 class="explore-title text-dark text-truncate w-75">
            {{ $tr('exploreTopics') }}
          </h4>
        </b-container>
      </b-row>
    </EkCardGrid>
    <EkCardGrid
      v-else
      :nodes="resultNodes"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
      variant="collapsible"
      @nodeUpdated="onResultNodesUpdated"
    >
      <div class="font-weight-bold my-4 text-muted">
        {{ $tr('resultsCount', { num_results: totalResults }) }}
        <EkKeywords :words="keywords" @click="removeKeyword" />
      </div>
    </EkCardGrid>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import updateNodeMixin from '@/mixins/updateNodeMixin';

// Escapes the RegExp special characters in string.
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  name: 'Search',
  mixins: [updateNodeMixin],
  data() {
    return {
      query: '',
      resultNodes: [],
      page: null,
      searching: false,
      hideUnavailable: window.kolibri.defaultHideUnavailable,
    };
  },
  computed: {
    ...mapGetters(['getAssetURL']),
    ...mapState(['mainSections', 'cardColumns', 'mediaQuality', 'searchQuery']),
    backgroundImageURL() {
      return this.getAssetURL('homeBackgroundImage');
    },
    notFound() {
      return !this.searching && !this.resultNodes.length && this.cleanedQuery !== '';
    },
    cleanedQuery() {
      return escapeRegExp(this.query.trim());
    },
    keywords() {
      return this.cleanedQuery.split(/\s+/);
    },
    totalResults() {
      // We have the real total results in the backend in this.page.total_results,
      // but the search doesn't have pagination, so it shows 30 nodes at max,
      // So for the UX it's better to show just the number of nodes returned by
      // the search API because it's not possible to show the rest.
      return this.resultNodes.length;
    },
  },
  watch: {
    cleanedQuery() {
      this.$store.commit('setSearchQuery', this.cleanedQuery);
      if (this.cleanedQuery === '') {
        this.searching = false;
        this.resultNodes = [];
        this.page = null;
        return;
      }
      this.searching = true;
      this.search();
    },
    searchQuery() {
      this.query = this.searchQuery;
    },
    hideUnavailable() {
      this.search();
    },
  },
  methods: {
    search() {
      return window.kolibri.searchContent({
        keyword: this.cleanedQuery,
        includeUnavailable: !this.hideUnavailable,
      })
        .then((page) => {
          this.page = page;
          this.resultNodes = page.results;
          this.searching = false;
        });
    },
    onClearInput() {
      this.query = '';
    },
    removeKeyword(keyword) {
      const words = this.keywords.filter((k) => k !== keyword);
      this.query = words.join(' ');
    },
    onResultNodesUpdated(nodeId) {
      return this.onNodeUpdated(nodeId, this.resultNodes);
    },
  },
  $trs: {
    onlyDownloadedItems: {
      message: 'Only downloaded items',
      context: 'Label for a search filter checkbox',
    },
    noContentFound: {
      message: 'Sorry, we can’t find any content that matches your search.',
      context: 'Text shown to the user when a search returns no results',
    },
    noContentFoundGuidance: {
      message: 'You can try a different search, maybe use fewer words, or try one of the topic suggestions below.',
      context: 'Guidance given to the user when no search results are found',
    },
    exploreTopics: {
      message: 'Explore topics',
      context: 'Heading for a section of content grid in the search results',
    },
    resultsCount: {
      message: '{num_results, number, integer} {num_results, plural, one {Result} other {Results}}',
      context: 'Number of results for a search',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.root {
  margin-top: $navbar-height;
}

.explore-title {
  margin-top: $big-spacer !important;
}

</style>
