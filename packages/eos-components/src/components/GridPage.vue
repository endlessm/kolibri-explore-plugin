<template>
  <b-row>
    <b-col
      v-for="node in nodes"
      :key="node.id"
      :cols="cardColumns.cols"
      :md="cardColumns.md"
      :lg="cardColumns.lg"
    >
      <Card :node="node" :mediaQuality="mediaQuality" />
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'GridPage',
  props: {
    nodes: Array,
    mediaQuality: String,
    cardColumns: Object,
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
