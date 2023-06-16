<template>
  <div>
    <EkCardGridPlaceholder v-if="loading" />
    <div v-else>
      <div v-if="!filteredNodes.length">
        <EmptyResultsMessage />
      </div>
      <EkCardGrid
        v-else
        variant="collapsible"
        :nodes="filteredNodes"
        :hasMoreNodes="hasMoreNodes"
        :mediaQuality="mediaQuality"
        :cardColumns="cardColumns"
        @loadMoreNodes="onLoadMoreNodes"
        @nodeUpdated="onFilterNodeUpdated"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { constants } from 'ek-components';
  import updateNodeMixin from '@/mixins/updateNodeMixin';

  export default {
    name: 'FilterResult',
    mixins: [updateNodeMixin],
    props: {
      node: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        filteredNodes: [],
        loading: false,
        pagination: null,
      };
    },
    computed: {
      ...mapState(['cardColumns', 'filters', 'isEndlessApp', 'mediaQuality']),
      query() {
        return this.filters.query;
      },
      filterParams() {
        const params = {
          maxResults: constants.ItemsPerPage,
          descendantOf: this.node ? this.node.id : null,
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

        // Filter by structured tags
        // this will be superceeded by the new taxonomy being tested in
        // https://phabricator.endlessm.com/T32647
        if (this.isEndlessApp) {
          Object.values(constants.StructuredTags).forEach((matchKey) => {
            const options = this.query[matchKey];
            if (options && options.length) {
              if (!params.tags) {
                params.tags = [];
              }
              const structuredTags = options.map((option) => `${matchKey}=${option}`);
              params.tags = [...params.tags, ...structuredTags];
            }
          });
        }

        return params;
      },
      hasMoreNodes() {
        return this.pagination !== null;
      },
    },
    watch: {
      query() {
        this.pagination = null;
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
          this.pagination = pageResult.more;
          this.loading = false;
        });
      },
      onLoadMoreNodes() {
        return window.kolibri.getContentPage(this.pagination).then((pageResult) => {
          this.filteredNodes = this.filteredNodes.concat(pageResult.results);
          this.pagination = pageResult.more;
        });
      },
      onFilterNodeUpdated(nodeId) {
        return this.onNodeUpdated(nodeId, this.filteredNodes);
      },
    },
  };
</script>
