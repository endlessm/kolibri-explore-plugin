<template>
  <SlidableGrid
    v-slot="slotProps"
    class="pb-4"
    :nodes="nodes"
    :hasMoreNodes="hasMoreNodes"
    :itemsPerSlide="itemsPerSlide"
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
import { ItemsPerSlide, MediaQuality } from '../constants';
import { validateItemsPerSlide } from '../utils';

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
    itemsPerSlide: {
      type: Object,
      default: () => ItemsPerSlide,
      validator: validateItemsPerSlide,
    },
  },
};
</script>
