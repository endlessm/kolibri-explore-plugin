<template>
  <span>
    <GridPage
      :nodes="visibleNodes"
      :cardColumns="cardColumns"
      :mediaQuality="mediaQuality"
    />

    <b-row alignH="center">
      <b-button
        v-if="canShowMore || areMoreNodes"
        :disabled="loading"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showMore"
      >
        <b-spinner v-if="loading" label="Spinning" small />
        <span v-else>
          Show more
        </span>
      </b-button>
      <b-button
        v-else-if="canShowLess"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showLess"
      >
        <span>Show less</span>
      </b-button>
    </b-row>
  </span>
</template>

<script>
import responsiveMixin from './mixins/responsiveMixin';

export default {
  name: 'CollapsibleCardGrid',
  mixins: [responsiveMixin],
  props: {
    nodes: Array,
    mediaQuality: String,
    cardColumns: Object,
    getMoreNodes: Function,
    itemsPerPage: {
      type: Number,
      default: 16,
    },
  },
  data() {
    return {
      // Display 4 rows of 4 cards (16 total) in a large screen.
      rowsToShow: Math.ceil(this.itemsPerPage * this.cardColumns.lg / 12),
      areMorePages: true,
      loading: false,
    };
  },
  computed: {
    initialRows() {
      return Math.ceil(this.itemsPerPage / this.columns);
    },
    canShowMore() {
      return (this.rowsToShow * this.columns) < this.nodes.length;
    },
    areMoreNodes() {
      return this.getMoreNodes && this.areMorePages;
    },
    canShowLess() {
      return this.rowsToShow > this.initialRows;
    },
    columns() {
      if (this.md) {
        return 12 / this.cardColumns.md;
      }
      if (this.lg || this.xl) {
        return 12 / this.cardColumns.lg;
      }
      return 12 / this.cardColumns.cols;
    },
    visibleNodes() {
      const elements = this.rowsToShow * this.columns;
      return this.nodes.slice(0, elements);
    },
  },
  methods: {
    getMore() {
      this.loading = true;
      return this.getMoreNodes()
        .then((nodes) => {
          const { page, totalPages, results } = nodes;
          if (results) {
            this.nodes = this.nodes.concat(results);
            this.rowsToShow++;
            if (page === totalPages) {
              this.areMorePages = false;
            }
          } else {
            this.areMorePages = false;
          }
          this.loading = false;
        });
    },
    showMore() {
      if (!this.canShowMore) {
        if (this.getMoreNodes) {
          this.getMore();
        }
        return;
      }
      this.rowsToShow++;
    },
    showLess() {
      if (!this.canShowLess) {
        return;
      }
      this.rowsToShow = this.initialRows;
    },
  },
};
</script>

<style lang="scss" scoped>

@import "../styles.scss";

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

button:hover {
  color: $primary !important;
}

</style>
