<template>
  <EkSlidableGrid
    v-slot="slotProps"
    class="pb-4"
    :nodes="nodes"
    :hasMoreNodes="hasMoreNodes"
    :itemsPerSlide="itemsPerSlide"
    @loadMoreNodes="$emit('loadMoreNodes')"
  >
    <EkCard
      v-for="node in slotProps.slideNodes"
      :key="node.id"
      :node="node"
      :mediaQuality="mediaQuality"
      @nodeUpdated="onNodeUpdated"
    />
  </EkSlidableGrid>
</template>

<script>
import { ItemsPerSlide, MediaQuality } from '../constants';
import { validateItemsPerSlide } from '../utils';

export default {
  name: 'EkSlidableCardGrid',
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
  methods: {
    onNodeUpdated(nodeId) {
      this.$emit('nodeUpdated', nodeId);
    },
  },
};
</script>
