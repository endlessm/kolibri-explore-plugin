<template>
  <div class="position-relative">
    <b-button
      v-if="hasMultipleSlides"
      variant="outline-primary"
      class="previous rounded-circle"
      :class="{ invisible: isFirstSlide }"
      aria-controls="carousel"
      @click="previous()"
    >
      <span aria-hidden="true"><b-icon-chevron-left /></span>
      <span class="sr-only">Previous slide</span>
    </b-button>
    <b-button
      v-if="hasMultipleSlides"
      variant="outline-primary"
      class="next rounded-circle"
      :disabled="loading"
      :class="{ invisible: hideNextButton }"
      aria-controls="carousel"
      @click="next()"
    >
      <span aria-hidden="true"><b-icon-chevron-right /></span>
      <span class="sr-only">Next slide</span>
    </b-button>
    <b-carousel
      id="carousel"
      ref="carousel"
      v-model="slide"
      :interval="0"
      @sliding-end="onSlidingEnd"
    >
      <b-carousel-slide
        v-for="(slideNodes, index) in slides"
        :key="'slide-' + index"
      >
        <template #img>
          <b-card-group
            deck
            class="my-2"
          >
            <Card
              v-for="node in slideNodes"
              :key="node.id"
              :node="node"
              :mediaQuality="mediaQuality"
            />
            <!-- eslint-disable vue/no-use-v-if-with-v-for -->
            <b-card
              v-for="n in emptyCardsNumber"
              v-if="index === slides.length - 1"
              :key="n"
              class="invisible"
            />
          </b-card-group>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
import _ from 'underscore';
import { ItemsPerSlide, MediaQuality } from '../constants';
import responsiveMixin from './mixins/responsiveMixin';

export default {
  name: 'SlidableCardGrid',
  mixins: [responsiveMixin],
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
  },
  data() {
    return {
      slide: 0,
      loading: false,
    };
  },
  computed: {
    itemsPerSlide() {
      if (this.xs) {
        return Math.ceil(ItemsPerSlide / 4);
      }
      if (this.sm || this.md) {
        return Math.ceil(ItemsPerSlide / 2);
      }
      return Math.ceil(ItemsPerSlide);
    },
    slides() {
      return _.chunk(this.nodes, this.itemsPerSlide);
    },
    emptyCardsNumber() {
      return this.slides.length * this.itemsPerSlide - this.nodes.length;
    },
    hasMultipleSlides() {
      return this.slides.length > 1;
    },
    isFirstSlide() {
      return this.slide === 0;
    },
    isLastSlide() {
      return this.slide === this.slides.length - 1;
    },
    hideNextButton() {
      return !this.hasMoreNodes && this.isLastSlide;
    }
  },
  watch: {
    nodes() {
      this.loading = false;
    },
  },
  methods: {
    previous() {
      this.$refs.carousel.prev();
    },
    next() {
      this.$refs.carousel.next();
    },
    onSlidingEnd() {
      if (this.hasMoreNodes && this.isLastSlide) {
        this.loading = true;
        this.$emit('loadMoreNodes');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";

$button-size: 3rem;

.btn.previous, .btn.next {
  position: absolute;
  top: 50%;
  margin-top: -$button-size / 2;
  bottom: 0;
  width: $button-size;
  height: $button-size;
  z-index: 4;
}

.btn.previous {
  left: -($button-size + $spacer);
}

.btn.next {
  right: -($button-size + $spacer);
}

.carousel {
  overflow: auto;
  overflow-x: hidden;
}

</style>
