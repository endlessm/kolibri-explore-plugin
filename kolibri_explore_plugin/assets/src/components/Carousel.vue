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
            content: '3e464ee12f6a50a781cddf59147b48b1',
          },
          {
            image: pbsImage,
            content: '1306b5d7d1ce4b98b0039324f368ce6a',
          },
          {
            image: oceanxImage,
            content: '85b42a40745f4e2392ed62e72d4dad6e',
          },
          {
            image: commonImage,
            content: 'bcc6e12a0ddf4a17a8b600c6b880e3ed',
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
      contentLink(channel_id) {
        return {
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id },
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
