<template>
  <SlidableGrid
    v-slot="slotProps"
    class="pb-4"
    :nodes="nodes"
    :hasMoreNodes="hasMoreNodes"
    @loadMoreNodes="$emit('loadMoreNodes')"
  >
    <Card
      v-for="node in slotProps.slideNodes"
      :key="node.id"
      :node="node"
      :mediaQuality="mediaQuality"
    />
  </SlidableGrid>
</template>

<script>
import { MediaQuality } from '../constants';

export default {
  name: 'SlidableCardGrid',
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
  },
};
</script>
