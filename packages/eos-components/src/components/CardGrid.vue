<template>
  <b-container class="my-5 section-container">
    <slot></slot>

    <component
      :is="displayVariant"
      :id="id"
      :nodes="nodes"
      :itemsPerPage="itemsPerPage"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    />
  </b-container>
</template>

<script>

export default {
  name: 'CardGrid',
  props: {
    nodes: Array,
    id: String,
    mediaQuality: String,
    cardColumns: Object,
    variant: {
      type: String,
      default: 'slidable',
      validator(value) {
        // The value must match one of these strings
        return ['paginated', 'collapsible', 'slidable'].includes(value);
      },
    },
    itemsPerPage: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    displayVariant() {
      switch (this.variant) {
        case 'paginated':
          return 'PaginatedCardGrid';
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
