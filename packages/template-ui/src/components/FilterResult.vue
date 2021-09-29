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
        :getMoreNodes="getMoreNodes"
        :mediaQuality="mediaQuality"
        :cardColumns="cardColumns"
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
        lastPage: 1,
      };
    },
    computed: {
      ...mapState(['cardColumns', 'filters', 'mediaQuality']),
      query() {
        return this.filters.query;
      },
      filterParams() {
        const params = { page: this.page };

        const mediaType = this.query[constants.MediaFilterName];
        if (mediaType && mediaType.length) {
          params.activityTypes = mediaType;
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

        window.kolibri.getContentByFilter(this.filterParams)
          .then((page) => {
            this.filteredNodes = page.results;
            this.lastPage = page.totalPages;
            this.loading = false;
          });
      },
      async getMoreNodes() {
        if (this.page === this.lastPage) {
          return [];
        }

        this.page++;
        const nodes = await window.kolibri.getContentByFilter(this.filterParams);
        return nodes;
      }
    },
  };
</script>
