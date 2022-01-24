<template>
  <div class="position-relative">
    <b-link
      v-if="hasMultipleSlides"
      class="link-previous"
      :class="{ invisible: isFirstSlide }"
      aria-controls="carousel"
      @click="previous()"
    >
      <!-- Size same as $circled-button-size -->
      <ChevronLeftCircleOutlineIcon :size="50" />
    </b-link>
    <div id="backgroud-block-left"></div>
    <div id="backgroud-block-right"></div>
    <b-link
      v-if="hasMultipleSlides"
      :disabled="loading"
      class="link-next"
      :class="{ invisible: hideNextButton }"
      aria-controls="carousel"
      @click="next()"
    >
      <!-- Size same as $circled-button-size -->
      <ChevronRightCircleOutlineIcon :size="50" />
    </b-link>
    <b-carousel
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
            class="card-deck my-2"
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
import ChevronLeftCircleOutlineIcon from 'vue-material-design-icons/ChevronLeftCircleOutline.vue';
import ChevronRightCircleOutlineIcon from 'vue-material-design-icons/ChevronRightCircleOutline.vue';
import { ItemsPerSlide, MediaQuality } from '../constants';
import responsiveMixin from './mixins/responsiveMixin';

export default {
  name: 'SlidableCardGrid',
  components: { ChevronLeftCircleOutlineIcon, ChevronRightCircleOutlineIcon },
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

#backgroud-block-left, #backgroud-block-right {
  position: absolute;
  width: $grid-gutter-width * .5 + $circled-button-size;
  height: 100%;
  z-index: 3; // Less than buttons, more than cards.
  top: 0;
}

#backgroud-block-left {
  left: 0;
  background: linear-gradient(90deg,
    $gray-300 0%,
    $gray-300 50%,
    rgba($gray-300, 0) 100%
  );
}

#backgroud-block-right {
  right: 0;

  background: linear-gradient(90deg,
    rgba($gray-300, 0) 0%,
    $gray-300 50%,
    $gray-300 100%
  );
}


.link-previous, .link-next {
  position: absolute;
  top: 50%;
  margin-top: -$circled-button-size / 2;
  bottom: 0;
  z-index: 4;
}

.link-previous {
  left: $grid-gutter-width * .5;
}

.link-next {
  right: $grid-gutter-width * .5;
}

.carousel {
  overflow: auto;
  overflow-x: hidden;
  & ::v-deep .carousel-inner {
    padding-right: $grid-gutter-width * .5 + $circled-button-size;
    padding-left: $grid-gutter-width * .5 + $circled-button-size;
  }
}

.card-deck {
    padding-right: $grid-gutter-width * .5;
    padding-left: $grid-gutter-width * .5;
}

</style>
