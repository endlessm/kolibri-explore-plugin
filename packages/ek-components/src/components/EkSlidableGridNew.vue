<template>
  <b-container fluid class="no-container-padding" style="overflow: hidden">
    <b-container>
      <SsrCarousel
        :key="nodes.length"
        v-model="slide"
        :gutter="gridGutterWidth"
        :slidesPerPage="itemsPerSlideComputed"
        overflowVisible
        paginateBySlide
        @change="onChange"
      >
        <slot :nodes="nodes"></slot>
      </SsrCarousel>
    </b-container>
  </b-container>
</template>

<script>
import SsrCarousel from 'vue-ssr-carousel';
import { ItemsPerSlide } from '../constants';
import { validateItemsPerSlide } from '../utils';
import { gridGutterWidth } from '../styles.scss';
import responsiveMixin from './mixins/responsiveMixin';

export default {
  name: 'EkSlidableGridNew',
  components: { SsrCarousel },
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
    itemsPerSlide: {
      type: Object,
      default: () => ItemsPerSlide,
      validator: validateItemsPerSlide,
    },
  },
  data() {
    return {
      slide: 0,
      gridGutterWidth,
    };
  },
  computed: {
    itemsPerSlideComputed() {
      if (this.xs) {
        return this.itemsPerSlide.sm;
      }
      if (this.sm || this.md) {
        return this.itemsPerSlide.md;
      }
      return this.itemsPerSlide.lg;
    },
  },
  methods: {
    onChange({ index }) {
      const isLastSlide = index >= this.nodes.length - this.itemsPerSlideComputed;
      if (this.hasMoreNodes && isLastSlide) {
        this.$emit('loadMoreNodes');
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
