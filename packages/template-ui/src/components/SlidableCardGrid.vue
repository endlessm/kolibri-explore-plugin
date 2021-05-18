<template>
  <div class="position-relative">
    <b-button
      v-if="hasMultipleSlides"
      @click="previous()"
      variant="outline-primary"
      class="previous rounded-circle"
      :class="{invisible: isFirstSlide}"
      aria-controls="carousel"
    >
      <span aria-hidden="true"><b-icon-chevron-left /></span>
      <span class="sr-only">Previous slide</span>
    </b-button>
    <b-button
      v-if="hasMultipleSlides"
      @click="next()"
      variant="outline-primary"
      class="next rounded-circle"
      :class="{invisible: isLastSlide}"
      aria-controls="carousel"
    >
      <span aria-hidden="true"><b-icon-chevron-right /></span>
      <span class="sr-only">Next slide</span>
    </b-button>
    <b-carousel
      id="carousel"
      ref="carousel"
      v-model="slide"
      :interval="0"
    >
      <b-carousel-slide
        v-for="(slideNodes, index) in slides"
        :key="'slide-' + index"
      >
        <template #img>
          <b-card-group
            :deck="!isHighQualityMedia"
          >
            <Card
              v-for="node in slideNodes"
              :key="node.id"
              :node="node"
            />
            <!-- eslint-disable vue/no-use-v-if-with-v-for -->
            <b-card
              class="invisible"
              v-if="index === slides.length - 1"
              v-for="n in emptyCardsNumber"
              :key="n"
            />
          </b-card-group>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
import _ from 'underscore';
import { mapGetters } from 'vuex';

export default {
  props: {
    nodes: Array,
    id: String,
    itemsPerPage: {
      type: Number,
      default: 8,
    },
  },
  data() {
    return {
      slide: 0,
    };
  },
  computed: {
    ...mapGetters(['isHighQualityMedia']),
    itemsPerSlide() {
      // FIXME divide by 4 if small screen
      return Math.ceil(this.itemsPerPage / 2);
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
  },
  methods: {
    previous() {
      this.$refs.carousel.prev();
    },
    next() {
      this.$refs.carousel.next();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles.scss";

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

</style>
