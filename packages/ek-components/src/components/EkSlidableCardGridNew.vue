<template>
  <EkSlidableGridNew
    v-slot="slotProps"
    class="pb-4"
    :nodes="nodes"
    :hasMoreNodes="hasMoreNodes"
    :itemsPerSlide="itemsPerSlide"
    @loadMoreNodes="$emit('loadMoreNodes')"
  >
    <div
      v-for="(node, index) in slotProps.nodes"
      :key="node.id"
      class="slide"
      :index="index"
    >
      <EkCard
        :node="node"
        :mediaQuality="mediaQuality"
        @nodeUpdated="onNodeUpdated"
      />
    </div>
  </EkSlidableGridNew>
</template>

<script>
import { ItemsPerSlide, MediaQuality } from '../constants';
import { validateItemsPerSlide } from '../utils';

export default {
  name: 'EkSlidableCardGridNew',
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
