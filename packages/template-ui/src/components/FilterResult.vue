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
        page: 1,
        hasMoreNodes: false,
      };
    },
    computed: {
      ...mapState(['cardColumns', 'filters', 'mediaQuality']),
      query() {
        return this.filters.query;
      },
      filterParams() {
        const params = { page: this.page, pageSize: 16 };

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
        this.page = 1;
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
          this.hasMoreNodes = pageResult.page < pageResult.totalPages;
          this.loading = false;
        });
      },
      onLoadMoreNodes() {
        this.page++;
        return window.kolibri.getContentByFilter(this.filterParams)
        .then((pageResult) => {
          this.filteredNodes = this.filteredNodes.concat(pageResult.results);
          this.hasMoreNodes = pageResult.page < pageResult.totalPages;
        });
      },
    },
  };
</script>
