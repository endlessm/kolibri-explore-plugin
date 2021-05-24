<template>
  <span>
    <GridPage :nodes="pageNodes" />

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
import { mapState } from 'vuex';

export default {
  name: 'PaginatedCardGrid',
  props: {
    nodes: Array,
    itemsPerPage: {
      type: Number,
      default: 8,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    ...mapState(['filters']),
    filterQuery() {
      return this.filters.query;
    },
    pageNodes() {
      const { currentPage, itemsPerPage, nodes } = this;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return nodes.slice(start, end);
    },
  },
  watch: {
    filterQuery() {
      // Change to first page if the filter changes. This is needed because the
      // number of cards to show will change and the previous pagination can be
      // wrong.
      this.currentPage = 1;
    },
  },
};
</script>
