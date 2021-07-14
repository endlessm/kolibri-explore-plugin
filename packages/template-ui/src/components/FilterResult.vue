<template>
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
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'FilterResult',
    props: { node: Object },
    computed: {
      ...mapState(['cardColumns', 'mediaQuality']),
      ...mapGetters({
        filterNodes: 'filters/filterNodes',
      }),
      filteredNodes() {
        return this.filterNodes(this.node.children);
      },
    },
  };
</script>
