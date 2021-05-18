<template>
  <span>
    <GridPage :nodes="nodes.slice(0, itemsPerPage)" />

    <b-collapse
      :id="'collapse-' + id"
      :class="{'mt-2': !isHighQualityMedia}"
    >
      <GridPage :nodes="nodes.slice(itemsPerPage)" />
    </b-collapse>

    <b-row align-h="center" v-if="nodes.length > itemsPerPage">
      <b-button class="mt-2" v-b-toggle="'collapse-' + id" variant="light">
        <span class="when-open">Show less</span>
        <span class="when-closed">Show more</span>
        <b-icon-arrow-up class="when-open" />
        <b-icon-arrow-down class="when-closed" />
      </b-button>
    </b-row>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CollapsibleCardGrid',
  props: {
    nodes: Array,
    id: String,
    itemsPerPage: {
      type: Number,
      default: 8,
    },
  },
  computed: {
    ...mapGetters(['isHighQualityMedia']),
  },
};
</script>

<style lang="scss" scoped>

@import "@/styles.scss";

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

button:hover {
  color: $primary !important;
}

</style>
