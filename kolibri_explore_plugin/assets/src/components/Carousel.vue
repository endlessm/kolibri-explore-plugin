<template>

  <div>
    <b-carousel
      id="carousel"
      class="carousel shadow"
      :interval="interval"
      indicators
      :imgWidth="width"
      :imgHeight="height"
    >
      <b-carousel-slide
        v-for="slide in slides"
        :key="slide.content"
        :caption="slide.caption"
        :text="slide.text"
        :imgSrc="slide.image"
      >
        <template #img>
          <router-link :to="contentLink(slide.content)">
            <img
              class="d-block img-fluid w-100"
              :width="width"
              :height="height"
              :src="slide.image"
            >
          </router-link>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>

</template>


<script>

  import { PageNames } from '../constants';
  import sikanaImage from '../assets/sikana-yoga.jpg';
  import pbsImage from '../assets/pbs-kids-banner.jpg';
  import oceanxImage from '../assets/oceanx.jpg';
  import commonImage from '../assets/common-sense.jpg';

  export default {
    name: 'Carousel',
    props: {
      slides: {
        type: Array,
        default: () => [
          {
            image: sikanaImage,
            content: '4adb51edf0e75de6be1c81be58e27a0d',
          },
          {
            image: pbsImage,
            content: '4adb51edf0e75de6be1c81be58e27a0e',
          },
          {
            image: oceanxImage,
            content: '4adb51edf0e75de6be1c81be58e27a0f',
          },
          {
            image: commonImage,
            content: '4adb51edf0e75de6be1c81be58e27a0g',
          },
        ],
      },
      width: {
        type: Number,
        default: 1440,
      },
      height: {
        type: Number,
        default: 368,
      },
      interval: {
        type: Number,
        default: 4000,
      },
    },
    methods: {
      contentLink(content_id) {
        return {
          name: PageNames.TOPICS_CONTENT,
          params: { id: content_id },
        };
      },
    },
  };

</script>


<style lang="scss" scoped>

  .carousel {
    text-shadow: 1px 1px 2px #333333;
  }

</style>
