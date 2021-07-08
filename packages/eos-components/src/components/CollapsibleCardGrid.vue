<template>
  <span>
    <GridPage
      :nodes="nodes.slice(0, itemsPerPage)"
      :cardColumns="cardColumns"
      :mediaQuality="mediaQuality"
    />

    <b-collapse
      :id="'collapse-' + id"
      class="mt-2"
    >
      <GridPage
        :nodes="nodes.slice(itemsPerPage)"
        :cardColumns="cardColumns"
        :mediaQuality="mediaQuality"
      />
    </b-collapse>

    <b-row v-if="nodes.length > itemsPerPage" alignH="center">
      <b-button v-b-toggle="'collapse-' + id" class="mt-2" variant="light">
        <span class="when-open">Show less</span>
        <span class="when-closed">Show more</span>
        <b-icon-arrow-up class="when-open" />
        <b-icon-arrow-down class="when-closed" />
      </b-button>
    </b-row>
  </span>
</template>

<script>

export default {
  name: 'CollapsibleCardGrid',
  props: {
    nodes: Array,
    id: String,
    mediaQuality: String,
    cardColumns: Object,
    itemsPerPage: {
      type: Number,
      default: 8,
    },
  },
};
</script>

<style lang="scss" scoped>

@import "../styles.scss";

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

button:hover {
  color: $primary !important;
}

</style>
