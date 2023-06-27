<template>
  <b-container
    class="mb-5 mt-3 section-container"
    :fluid="displayVariant === 'EkSlidableCardGridNew'"
    :class="{ 'no-container-padding': (
      displayVariant === 'EkSlidableCardGrid' ||
      displayVariant === 'EkSlidableCardGridNew'
    ) }"
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
        return { cols: 6, sm: 12, md: 6, lg: 3 };
      },
    },
    variant: {
      type: String,
      default: 'slidable',
      validator(value) {
        // The value must match one of these strings
        return ['collapsible', 'slidable', 'slidable-new'].includes(value);
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
      if (this.variant === 'slidable-new' && this.itemsPerSlide.lg >= this.nodes.length) {
        // There is no need to display a more complex component if there is no pagination:
        return 'EkGridPage';
      }
      switch (this.variant) {
        case 'collapsible':
          return 'EkCollapsibleCardGrid';
        case 'slidable-new':
          return 'EkSlidableCardGridNew';
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
