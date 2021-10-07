<template>
  <span>
    <GridPage :nodes="pageNodes" :cardColumns="cardColumns" :mediaQuality="mediaQuality" />

    <b-pagination
      v-if="nodes.length > itemsPerPage"
      v-model="currentPage"
      :totalRows="nodes.length"
      :perPage="itemsPerPage"
      align="center"
    />
  </span>
</template>

<script>
import { ItemsPerPage } from '../constants';

export default {
  name: 'PaginatedCardGrid',
  props: {
    nodes: Array,
    mediaQuality: String,
    cardColumns: Object,
    itemsPerPage: {
      type: Number,
      default: ItemsPerPage,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    pageNodes() {
      const { currentPage, itemsPerPage, nodes } = this;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return nodes.slice(start, end);
    },
  },
  watch: {
    '$store.state.filters.query': {
      deep: true,
      handler() {
        // Change to first page if the filter changes. This is needed because the
        // number of cards to show will change and the previous pagination can be
        // wrong.
        this.currentPage = 1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
