<template>
  <transition-group name="fade" mode="in-out" tag="div" class="row">
    <b-col
      v-for="node in nodes"
      :key="node.id"
      :cols="cardColumns.cols"
      :md="cardColumns.md"
      :lg="cardColumns.lg"
    >
      <EkCard :node="node" :mediaQuality="mediaQuality" />
    </b-col>
  </transition-group>
</template>

<script>
import { MediaQuality } from '../constants';

export default {
  name: 'EkGridPage',
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    cardColumns: {
      type: Object,
      required: true,
    },
    mediaQuality: {
      type: String,
      default: MediaQuality.REGULAR,
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

  .fade-enter-active, .fade-leave-active {
    @include transition($transition-fade);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
