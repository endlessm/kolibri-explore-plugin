<template>

  <b-container fluid>
    <h4 class="mx-1 mx-lg-3 mx-md-2">
      {{ label }}:
    </h4>
    <b-button-toolbar ref="toolbar" v-b-hover="onHover" class="my-4">
      <b-button
        v-if="navButtonsVisible && hasPrevious && !animating"
        :disabled="buttonsDisabled"
        variant="outline"
        pill
        class="nav-button prev"
        size="lg"
        @click="goPrevious"
      >
        <b-icon-chevron-left />
      </b-button>
      <b-button
        v-if="navButtonsVisible && hasNext && !animating"
        :disabled="buttonsDisabled"
        variant="outline"
        pill
        class="nav-button next"
        size="lg"
        @click="goNext"
      >
        <b-icon-chevron-right />
      </b-button>
      <b-button-group
        v-for="(node, index) in getVisibleCards()"
        :key="node.id"
        :style="getButtonStyle(index)"
      >
        <router-link :to="contentLink(node.id)">
          <b-button
            :disabled="isButtonDisabled(index)"
            variant="outline-light"
            class="demo-button mx-1 mx-lg-3 mx-md-2 shadow"
            :style="getNodeStyles(node)"
          />
        </router-link>
      </b-button-group>
    </b-button-toolbar>
  </b-container>

</template>


<script>

  import debounce from 'lodash/debounce';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import { PageNames } from '../constants';
  import placeholder from '../assets/placeholder.png';

  export default {
    name: 'TagRow',
    props: {
      label: String,
      nodes: Array,
    },
    data() {
      return {
        placeholder,
        navButtonsVisible: false,
        breakpoints: {},
        margin: 0,
        containerWidth: 0,
        buttonWidth: 0,
        buttonHeight: 0,
        cardsPerRow: 5,
        offset: 0,
        animating: false,
        animateTo: 0, // -1 left, 1 right
      };
    },
    computed: {
      hasPrevious: function() {
        return this.offset > 0;
      },
      hasNext: function() {
        return this.offset + this.cardsPerRow < this.nodes.length;
      },
      buttonsDisabled: function() {
        return this.animating;
      },
    },
    watch: {
      containerWidth: function() {
        this.debouncedUpdate();
      },
    },
    created() {
      window.addEventListener('resize', this.onResize);
      const style = getComputedStyle(document.body);
      this.breakpoints['xs'] = parseInt(
        style.getPropertyValue('--breakpoint-xs').replace('px', ''),
        10
      );
      this.breakpoints['sm'] = parseInt(
        style.getPropertyValue('--breakpoint-sm').replace('px', ''),
        10
      );
      this.breakpoints['md'] = parseInt(
        style.getPropertyValue('--breakpoint-md').replace('px', ''),
        10
      );
      this.breakpoints['lg'] = parseInt(
        style.getPropertyValue('--breakpoint-lg').replace('px', ''),
        10
      );
      this.breakpoints['xl'] = parseInt(
        style.getPropertyValue('--breakpoint-xl').replace('px', ''),
        10
      );
      this.debouncedUpdate = debounce(this.updateImageWidth, 500);
    },
    destroyed() {
      window.removeEventListener('resize', this.onResize);
    },
    mounted() {
      this.onResize();
    },
    methods: {
      onHover(isHovered) {
        this.navButtonsVisible = isHovered;
      },
      getVisibleCards() {
        if (this.hasPrevious) {
          return this.nodes.slice(this.offset - 1, this.offset + this.cardsPerRow + 1); // FIXME slice, offset
        }
        return this.nodes.slice(this.offset, this.offset + this.cardsPerRow + 2); // FIXME slice, offset
      },
      getNodeStyles(node) {
        var background = this.placeholder;
        if (node.files) {
          background = getContentNodeThumbnail(node) || this.placeholder;
        }

        return {
          width: `${this.buttonWidth}px`,
          height: `${this.buttonHeight}px`,
          backgroundImage: `url(${background})`,
        };
      },
      goNext() {
        const { toolbar } = this.$refs;
        const m = this.buttonWidth + this.margin;
        toolbar.$el.setAttribute(
          'style',
          `transform: translate3d(-${m}px, 0, 0); transition: transform 0.5s ease-out;`
        );
        this.animating = true;
        this.animateTo = -1;
        setTimeout(() => {
          this.offset += 1;
          this.animating = false;
          toolbar.$el.setAttribute('style', '');
        }, 500);
      },
      goPrevious() {
        const { toolbar } = this.$refs;
        const m = this.buttonWidth + this.margin;
        toolbar.$el.setAttribute(
          'style',
          `transform: translate3d(${m}px, 0, 0); transition: transform 0.5s ease-out;`
        );
        this.animating = true;
        this.animateTo = 1;
        setTimeout(() => {
          this.offset -= 1;
          this.animating = false;
          toolbar.$el.setAttribute('style', '');
        }, 500);
      },
      isButtonDisabled(index) {
        return (
          (this.offset === 0 && index === this.cardsPerRow) ||
          (index === 0 && this.hasPrevious) ||
          (index === this.cardsPerRow + 1 && this.hasNext)
        );
      },
      getButtonStyle(index) {
        if (index !== 0) {
          return {};
        }

        const m = this.buttonWidth + this.margin;
        if (this.hasPrevious) {
          return { marginLeft: `-${m}px` };
        }
        return {};
      },
      onResize() {
        this.containerWidth = this.$refs.toolbar.$el.clientWidth;
      },
      updateImageWidth() {
        const width = window.innerWidth;
        if (width >= this.breakpoints['lg']) {
          this.margin = 30; // 2 * spacers[3]
          if (width >= this.breakpoints['xl']) {
            this.cardsPerRow = 5;
          } else {
            this.cardsPerRow = 4;
          }
        } else if (width < this.breakpoints['lg'] && width >= this.breakpoints['md']) {
          this.margin = 15; // 2 * spacers[2]
          this.cardsPerRow = 3;
        } else if (width < this.breakpoints['md']) {
          this.margin = 7.5; // 2 * spacers[1]
          this.cardsPerRow = 2;
        }
        this.buttonWidth =
          (this.containerWidth - this.cardsPerRow * this.margin) / this.cardsPerRow;
        this.buttonHeight = this.buttonWidth / 1.7804; // aprox 600 / 337
      },
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

  .container-fluid {
    overflow: hidden;
  }

  .btn-toolbar {
    position: relative;
    flex-wrap: nowrap;
  }

  $nav-button-size: 50px;

  .nav-button {
    position: absolute;
    top: 50%;
    z-index: 1000;
    width: $nav-button-size;
    height: $nav-button-size;
    padding: 6px 0;
    transform: translateY(-$nav-button-size/2);
    &.prev {
      left: -$nav-button-size;
    }
    &.next {
      right: -$nav-button-size;
    }
  }

  .btn-outline-light.disabled:hover {
    border-color: transparent;
  }

  .demo-button {
    padding: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-color: transparent;
    border-width: 3px;
    transition: all 300ms;

    &:not(.disabled) {
      &:hover {
        border-color: white;
        transform: scale(1.05);
      }
    }
  }

</style>
