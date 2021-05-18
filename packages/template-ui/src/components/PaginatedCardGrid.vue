<template>
  <span>
    <GridPage :nodes="pageNodes" />

    <b-pagination
      v-if="nodes.length > itemsPerPage"
      v-model="currentPage"
      :total-rows="nodes.length"
      :per-page="itemsPerPage"
      align="center"
    />
  </span>
</template>

<script>

export default {
  name: 'PaginatedCardGrid',
  props: {
    nodes: Array,
    id: String,
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
    pageNodes() {
      const { currentPage, itemsPerPage, nodes } = this;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return nodes.slice(start, end);
    },
  },
};
</script>
