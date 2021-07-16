<template>
  <span>
    <GridPage
      :nodes="visibleNodes"
      :cardColumns="cardColumns"
      :mediaQuality="mediaQuality"
    />

    <b-row alignH="center">
      <b-button
        v-if="canShowMore"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showMore"
      >
        <span>Show more</span>
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
    itemsPerPage: {
      type: Number,
      default: 16,
    },
  },
  data() {
    return {
      // Display 4 rows of 4 cards (16 total) in a large screen.
      rowsToShow: Math.ceil(this.itemsPerPage * this.cardColumns.lg / 12),
    };
  },
  computed: {
    initialRows() {
      return Math.ceil(this.itemsPerPage / this.columns);
    },
    canShowMore() {
      return (this.rowsToShow * this.columns) < this.nodes.length;
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
    showMore() {
      if (!this.canShowMore) {
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
