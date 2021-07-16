<template>
  <transition-group name="fade" mode="in-out" tag="div" class="row">
    <b-col
      v-for="node in nodes"
      :key="node.id"
      :cols="cardColumns.cols"
      :md="cardColumns.md"
      :lg="cardColumns.lg"
    >
      <Card :node="node" :mediaQuality="mediaQuality" />
    </b-col>
  </transition-group>
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

  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
