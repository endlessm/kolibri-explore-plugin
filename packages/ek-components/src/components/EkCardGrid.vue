<template>
  <b-container
    class="mb-5 mt-3 section-container"
    :class="{ 'no-container-padding': variant === 'slidable' }"
  >
    <slot></slot>

    <component
      :is="displayVariant"
      :nodes="nodes"
      :hasMoreNodes="hasMoreNodes"
      :itemsPerPage="itemsPerPage"
      :itemsPerSlide="itemsPerSlide"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
      @loadMoreNodes="$emit('loadMoreNodes')"
      @nodeUpdated="onNodeUpdated"
    />
  </b-container>
</template>

<script>
import { ItemsPerPage, ItemsPerSlide, MediaQuality } from '../constants';
import { validateItemsPerSlide } from '../utils';

export default {
  name: 'EkCardGrid',
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
    cardColumns: {
      type: Object,
      default() {
        return { cols: 6, md: 4, lg: 3 };
      },
    },
    variant: {
      type: String,
      default: 'slidable',
      validator(value) {
        // The value must match one of these strings
        return ['collapsible', 'slidable'].includes(value);
      },
    },
    itemsPerPage: {
      type: Number,
      default: ItemsPerPage,
    },
    itemsPerSlide: {
      type: Object,
      default: () => ItemsPerSlide,
      validator: validateItemsPerSlide,
    },
  },
  computed: {
    displayVariant() {
      switch (this.variant) {
        case 'collapsible':
          return 'EkCollapsibleCardGrid';
        case 'slidable':
        default:
          return 'EkSlidableCardGrid';
      }
    },
  },
  methods: {
    onNodeUpdated(nodeId) {
      this.$emit('nodeUpdated', nodeId);
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
