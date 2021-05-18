<template>
<b-container class="mb-4">
  <b-carousel
    fade
    v-model="slide"
    :interval="CAROUSEL_INTERVAL"
    class="shadow-lg"
  >
    <CarouselCard
      v-for="node in carouselNodes"
      :key="'item-' + node.id"
      :node="node"
    >
    </CarouselCard>
  </b-carousel>
</b-container>
</template>

<script>
import { CAROUSEL_INTERVAL } from '@/constants';
import { mapState } from 'vuex';
import _ from 'underscore';

export default {
  name: 'Carousel',
  data() {
    return {
      slide: 0,
      CAROUSEL_INTERVAL,
    };
  },
  computed: {
    ...mapState(['nodes', 'carouselNodeIds', 'carouselSlideNumber']),
    carouselNodes() {
      if (this.carouselNodeIds.length) {
        return this.carouselNodesFixed(this.carouselNodeIds);
      }

      return this.carouselNodesRandom(this.carouselSlideNumber);
    },
  },
  methods: {
    carouselNodesRandom(n) {
      // Get n random nodes that are not topic:
      const possibleNodes = this.nodes.filter((node) => node.kind !== 'topic');
      return _.sample(possibleNodes, n);
    },
    carouselNodesFixed(nodeIds) {
      return nodeIds.map((n) => (
        this.nodes.find((m) => m.id === n.id)
      ));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.carousel-item {
  background: $secondary !important;
}
.carousel {
  border-radius: $border-radius-lg;
}
</style>
