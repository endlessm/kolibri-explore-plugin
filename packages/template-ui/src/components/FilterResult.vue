<template>
  <div>
    <CardGridPlaceholder v-if="loading" />

    <div v-if="!filteredNodes.length">
      <EmptyResultsMessage />
    </div>
    <CardGrid
      v-else
      variant="collapsible"
      :nodes="filteredNodes"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    />
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
      };
    },
    computed: {
      ...mapState(['cardColumns', 'filters', 'isEndlessApp', 'mediaQuality']),
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

        // Filter by structured tags
        if (this.isEndlessApp) {
          Object.values(constants.StructuredTags).forEach((matchKey) => {
            const options = this.query[matchKey];
            if (options && options.length) {
              if (!params.tags) {
                params.tags = [];
              }
              options.forEach((option) => {
                params.tags.push(`${matchKey}=${option}`);
              });
            }
          });
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
        const filter = {};

        const MediaFilterName = 'Learning activity';
        const mediaType = this.query[MediaFilterName];
        if (mediaType && mediaType.length) {
          filter.activityType = mediaType;
        }

        window.kolibri.getContentByFilter(filter)
          .then((page) => {
            // FIXME: implement the pagination
            this.filteredNodes = page.results;
            this.loading = false;
          });
      },
    },
  };
</script>
