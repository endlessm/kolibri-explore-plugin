<template>
  <span>
    <EkGridPage
      :nodes="visibleNodes"
      :cardColumns="cardColumns"
      :mediaQuality="mediaQuality"
      @nodeUpdated="onNodeUpdated"
    />

    <b-row alignH="center">
      <b-button
        v-if="canShowMore"
        :disabled="loading"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showMore"
      >
        <b-spinner v-if="loading" :label="$tr('spinnerLabel')" small />
        <span v-else>
          {{ $tr('showMoreButton') }}
        </span>
      </b-button>
      <b-button
        v-else-if="canShowLess"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showLess"
      >
        <span>{{ $tr('showLessButton') }}</span>
      </b-button>
    </b-row>
  </span>
</template>

<script>
import { ItemsPerPage, MediaQuality } from '../constants';
import responsiveMixin from './mixins/responsiveMixin';

export default {
  name: 'EkCollapsibleCardGrid',
  mixins: [responsiveMixin],
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    hasMoreNodes: {
      type: Boolean,
      default: false,
    },
    mediaQuality: {
      type: String,
      default: MediaQuality.REGULAR,
    },
    cardColumns: {
      type: Object,
      default() {
        return { cols: 6, md: 4, lg: 3 };
      },
    },
    itemsPerPage: {
      type: Number,
      default: ItemsPerPage,
    },
  },
  data() {
    return {
      // Display 4 rows of 4 cards (16 total) in a large screen.
      rowsToShow: Math.min(
        Math.ceil(this.itemsPerPage * this.cardColumns.lg / 12),
        Math.ceil(this.nodes.length * this.cardColumns.lg / 12),
      ),
      loading: false,
    };
  },
  computed: {
    initialRows() {
      return Math.ceil(this.itemsPerPage / this.columns);
    },
    totalRows() {
      return Math.ceil(this.nodes.length / this.columns);
    },
    isLastRow() {
      return this.rowsToShow === this.totalRows;
    },
    canShowMore() {
      return !this.isLastRow || this.hasMoreNodes;
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
  watch: {
    nodes() {
      if (this.loading) {
        this.loading = false;
        this.rowsToShow++;
      }
    },
  },
  methods: {
    showMore() {
      if (this.hasMoreNodes && this.isLastRow) {
        this.loading = true;
        this.$emit('loadMoreNodes');
      } else {
        this.rowsToShow++;
      }
    },
    showLess() {
      if (!this.canShowLess) {
        return;
      }
      this.rowsToShow = this.initialRows;
    },
    onNodeUpdated(nodeId) {
      this.$emit('nodeUpdated', nodeId);
    },
  },
  $trs: {
    showMoreButton: {
      message: 'Show more',
      context: 'Button to expand a collapsible card grid',
    },
    showLessButton: {
      message: 'Show less',
      context: 'Button to collapse a collapsible card grid',
    },
    spinnerLabel: {
      message: 'Spinning',
      context: 'Label for a loading spinner',
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
