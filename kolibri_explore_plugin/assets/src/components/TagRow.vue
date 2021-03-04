<template>

  <b-container fluid>
    <h4 class="mx-1 mx-lg-3 mx-md-2">
      {{ label }}:
    </h4>
    <b-button-toolbar ref="toolbar" class="my-4">
      <b-button
        v-if="hasPrevious"
        :disabled="buttonsDisabled"
        variant="dark"
        pill
        class="nav-button prev"
        size="lg"
        @click="goPrevious"
      >
        <b-icon-chevron-left />
      </b-button>
      <b-button
        v-if="hasNext"
        :disabled="buttonsDisabled"
        variant="dark"
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
        <b-button
          :disabled="isButtonDisabled(index)"
          variant="outline-light"
          class="demo-button mx-1 mx-lg-3 mx-md-2 shadow-lg"
          :style="{
            width: `${buttonWidth}px`,
            height: `${buttonHeight}px`,
            backgroundImageFoo: `url(${placeholder})`
          }"
        >
          {{ node.title }}
        </b-button>
      </b-button-group>
    </b-button-toolbar>
  </b-container>

</template>


<script>

  import debounce from 'lodash/debounce';
  import placeholder from '../assets/placeholder.png';

  export default {
    name: 'TagRow',
    props: {
      label: String,
    },
    data() {
      return {
        placeholder,
        breakpoints: {},
        margin: 0,
        containerWidth: 0,
        buttonWidth: 0,
        buttonHeight: 0,
        cardsPerRow: 5,
        offset: 0,
        animating: false,
        animateTo: 0, // -1 left, 1 right
        nodes: [
          { title: '1', id: '1' },
          { title: '2', id: '2' },
          { title: '3', id: '3' },
          { title: '4', id: '4' },
          { title: '5', id: '5' },
          { title: '6', id: '6' },
          { title: '7', id: '7' },
          { title: '8', id: '8' },
          { title: '9', id: '9' },
          { title: '10', id: '10' },
        ],
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
      getVisibleCards() {
        if (this.hasPrevious) {
          return this.nodes.slice(this.offset - 1, this.offset + this.cardsPerRow + 1); // FIXME slice, offset
        }
        return this.nodes.slice(this.offset, this.offset + this.cardsPerRow + 2); // FIXME slice, offset
      },
      goNext() {
        this.animating = true;
        this.animateTo = -1;
        setTimeout(() => {
          this.offset += 1;
          this.animating = false;
        }, 500);
      },
      goPrevious() {
        this.animating = true;
        this.animateTo = 1;
        setTimeout(() => {
          this.offset -= 1;
          this.animating = false;
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
        if (this.animating) {
          const step = 0.5; // FIXME animate from 0 to 1
          const dx = m * step * this.animateTo;
          if (this.hasPrevious) {
            if (this.animateTo === -1) {
              return { marginLeft: `-${m * 2 + dx}px` };
            } else {
              return { marginLeft: `-${m - dx}px` };
            }
          } else {
            return { marginLeft: `-${m + dx}px` };
          }
        }
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

  .demo-button {
    padding: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: all 300ms;

    &:not(.disabled) {
      &:hover {
        border-color: white;
        border-width: 3px;
        transform: scale(1.05);
      }
    }
  }

</style>
