<template>
  <b-container class="mb-5">
    <b-carousel
      v-model="slide"
      fade
      indicators
      :interval="interval"
      class="bg-secondary rounded-lg shadow"
    >
      <CarouselCard
        v-for="node in nodes"
        :key="'item-' + node.id"
        :showChannelIcon="showChannelIcon"
        :node="node"
      />
    </b-carousel>
  </b-container>
</template>

<script>

import { CarouselInterval } from '../constants';

export default {
  name: 'Carousel',
  props: {
    nodes: Array,
    showChannelIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      slide: 0,
      interval: CarouselInterval,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

::v-deep .carousel-indicators {
  bottom: -($spacer * 2.5);
}

::v-deep .carousel-indicators li {
  background-color: $gray-700;
  border-radius: $border-radius-sm !important;
  background-clip: border-box;
  border-top: 0px;
  border-bottom: 0px;
}

::v-deep .carousel-indicators li.active {
  width: $carousel-indicator-width * 2;
  background-color: $gray-900;
}

</style>
