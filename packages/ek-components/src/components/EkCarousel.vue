<template>
  <b-container class="mb-5">
    <b-carousel
      v-model="slide"
      fade
      indicators
      :interval="interval"
      class="bg-secondary rounded-lg with-shadow"
    >
      <b-carousel-slide
        v-for="node in nodes"
        :key="'item-' + node.id"
      >
        <template #img>

          <EkContentLink :url="getNodeUrl(node)">
            <EkCarouselCard
              :showChannelIcon="showChannelIcon"
              :node="node"
            />
          </EkContentLink>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </b-container>
</template>

<script>

import { CarouselInterval } from '../constants';
import { getNodeUrl } from '../utils';

export default {
  name: 'EkCarousel',
  props: {
    nodes: {
      type: Array,
      required: true,
    },
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
  methods: {
    getNodeUrl,
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

.with-shadow {
  transition: all ease .4s;
  box-shadow: $box-shadow-sm !important;
  &:hover {
    box-shadow: $box-shadow !important;
  }
}

</style>
