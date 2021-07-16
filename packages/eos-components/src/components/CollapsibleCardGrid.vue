<template>
  <span>
    <GridPage
      :nodes="visibleNodes"
      :cardColumns="cardColumns"
      :mediaQuality="mediaQuality"
    />

    <b-row alignH="center">
      <b-button
        v-if="rowsToShow > 1 || !showedAll"
        pill
        class="mt-2"
        variant="outline-dark"
        @click="showMore"
      >
        <span v-if="showedAll">Show less</span>
        <span v-else>Show more</span>
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
  },
  data() {
    return {
      rowsToShow: 1,
    };
  },
  computed: {
    showedAll() {
      return (this.rowsToShow * this.columns) >= this.nodes.length;
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
      if (this.showedAll) {
        this.rowsToShow = 1;
      } else {
        this.rowsToShow++;
      }
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
