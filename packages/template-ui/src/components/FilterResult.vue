<template>
  <div>
    <CardGridPlaceholder v-if="loading" />
    <div v-else>
      <div v-if="!filteredNodes.length">
        <EmptyResultsMessage />
      </div>
      <CardGrid
        v-else
        variant="collapsible"
        :nodes="filteredNodes"
        :hasMoreNodes="hasMoreNodes"
        :mediaQuality="mediaQuality"
        :cardColumns="cardColumns"
        @loadMoreNodes="onLoadMoreNodes"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { constants } from 'eos-components';

  export default {
    name: 'FilterResult',
    data() {
      return {
        filteredNodes: [],
        loading: false,
        hasMoreNodes: null,
      };
    },
    computed: {
      ...mapState(['cardColumns', 'filters', 'mediaQuality']),
      query() {
        return this.filters.query;
      },
      pageCursor() {
        if (!this.hasMoreNodes) {
          return null;
        }

        return this.hasMoreNodes.cursor;
      },
      filterParams() {
        const params = {
          cursor: this.pageCursor,
          maxResults: constants.ItemsPerPage,
        };

        const kinds = this.query[constants.MediaFilterName];
        if (kinds && kinds.length) {
          params.kinds = kinds;
        }
        const authors = this.query[constants.AuthorFilterName];
        if (authors && authors.length) {
          params.authors = authors;
        }
        const tags = this.query[constants.TagFilterName];
        if (tags && tags.length) {
          params.tags = tags;
        }

        return params;
      },
    },
    watch: {
      query() {
        this.hasMoreNodes = null;
        this.filterNodes();
      },
    },
    mounted() {
      this.filterNodes();
    },
    methods: {
      filterNodes() {
        this.loading = true;
        this.filteredNodes = [];

        return window.kolibri.getContentByFilter(this.filterParams)
        .then((pageResult) => {
          this.filteredNodes = pageResult.results;
          this.hasMoreNodes = pageResult.more;
          this.loading = false;
        });
      },
      onLoadMoreNodes() {
        return window.kolibri.getContentByFilter(this.filterParams)
        .then((pageResult) => {
          this.filteredNodes = this.filteredNodes.concat(pageResult.results);
          this.hasMoreNodes = pageResult.more;
        });
      },
    },
  };
</script>
