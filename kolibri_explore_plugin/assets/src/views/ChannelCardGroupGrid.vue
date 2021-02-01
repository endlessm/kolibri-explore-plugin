<template>

  <div ref="container" class="container">
    <div ref="carousel" class="carousel">
      <div
        v-for="content in contents"
        :key="content.id"
        class="carousel-item"
      >
        <ChannelCard
          :title="content.title"
          :backgroundImage="getBackgroundImage(content)"
          :kind="content.kind"
          :tagline="getTagLine(content)"
          :progress="content.progress || 0"
          :link="genContentLink(content.id, content.kind)"
          :contentId="content.content_id"
        />
      </div>

    </div>

    <KIconButton
      v-if="leftButton"
      class="left-button"
      size="large"
      appearance="raised-button"
      icon="chevronLeft"
      @click="scrollLeft"
    />
    <KIconButton
      v-if="rightButton"
      class="right-button"
      size="large"
      appearance="raised-button"
      icon="chevronRight"
      @click="scrollRight"
    />
  </div>

</template>


<script>

  import { validateLinkObject } from 'kolibri.utils.validators';
  import urls from 'kolibri.urls';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import { CustomChannelApps } from '../constants';
  import ChannelCard from './ChannelCard';

  export default {
    name: 'ChannelCardGroupGrid',
    components: {
      ChannelCard,
    },
    mixins: [responsiveWindowMixin],
    props: {
      contents: {
        type: Array,
        required: true,
      },
      genContentLink: {
        type: Function,
        validator(value) {
          return validateLinkObject(value(1, 'exercise'));
        },
        /* eslint-disable no-empty-function */
        default: () => {},
        required: false,
      },
    },
    data: () => ({
      modalIsOpen: false,
      sharedContentId: null,
      uniqueId: null,
      isMounted: false,
      leftButton: false,
      rightButton: false,
      offset: 0,
      scrollOffset: 510,
    }),

    computed: {},

    mounted() {
      this.isMounted = true;
      this.smoothScroll(0);
    },

    methods: {
      getTagLine(content) {
        return content.tagline || content.description;
      },
      getBackgroundImage(content) {
        const app = CustomChannelApps[content.id];
        const bg = urls['kolibri:kolibri_explore_plugin:app_file']({
          app: app,
          filename: 'background.jpg',
        });
        return `url(${bg})`;
      },
      scrollLeft() {
        this.smoothScroll(this.scrollOffset);
      },
      scrollRight() {
        this.smoothScroll(-this.scrollOffset);
      },
      smoothScroll(offset) {
        const { carousel } = this.$refs;
        const elements = this.contents.length;
        const carouselWidth = elements * this.scrollOffset;
        let maxOffset = carouselWidth - carousel.offsetWidth;

        if (carousel.offsetWidth > carouselWidth) {
          maxOffset = 0;
        }

        this.leftButton = true;
        this.rightButton = true;
        this.offset += offset;

        // Left boundary, hide the left button
        if (this.offset >= 0) {
          this.offset = 0;
          this.leftButton = false;
        }

        // Right boundary, hide the right button
        if (this.offset <= -maxOffset) {
          this.rightButton = false;
          this.offset = -maxOffset;
        }

        carousel.setAttribute('style', `transform: translate3d(${this.offset}px, 0, 0)`);
      },
    },
  };

</script>


<style lang="scss" scoped>

  .carousel {
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.3s ease-out;
  }

  .carousel-item {
    min-width: 500px;
    margin: 5px;
  }

  .container {
    position: relative;
    overflow: hidden;
  }

  .left-button,
  .right-button {
    position: absolute;
    top: calc(50% - 48px);
    color: white;
  }

  .left-button {
    left: 5px;
  }

  .right-button {
    right: 5px;
  }

</style>
