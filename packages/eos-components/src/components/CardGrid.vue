<template>
  <b-container class="mb-5 mt-4 section-container">
    <slot></slot>

    <component
      :is="displayVariant"
      :nodes="nodes"
      :hasMoreNodes="hasMoreNodes"
      :itemsPerPage="itemsPerPage"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
      @loadMoreNodes="$emit('loadMoreNodes')"
    />
  </b-container>
</template>

<script>
import { ItemsPerPage, MediaQuality } from '../constants';

export default {
  name: 'CardGrid',
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
  },
  computed: {
    displayVariant() {
      switch (this.variant) {
        case 'collapsible':
          return 'CollapsibleCardGrid';
        case 'slidable':
        default:
          return 'SlidableCardGrid';
      }
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
