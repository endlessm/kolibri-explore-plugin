<template>

  <b-container fluid>
    <b-button-toolbar ref="toolbar" class="my-4">
      <b-button-group v-for="node in nodes" :key="node.id">
        <b-button
          variant="outline-light"
          class="demo-button mx-1 mx-lg-3 mx-md-2 shadow"
          :style="getButtonStyle(node)"
        />
      </b-button-group>
    </b-button-toolbar>
  </b-container>

</template>


<script>

  import debounce from 'lodash/debounce';
  // import placeholder from '../assets/placeholder.png';
  import sikanaImage from '../assets/sikana-cp.png';
  import pbsImage from '../assets/pbs-kids-cp.png';
  import oceanxImage from '../assets/preview-oceanx.png';
  import tedxImage from '../assets/teded.png';
  // import khanImage from '../assets/khan-academy.png';
  import commonImage from '../assets/common.png';

  export default {
    name: 'ContentProvidersRow',
    data() {
      return {
        breakpoints: {},
        containerWidth: 0,
        buttonWidth: 0,
        buttonHeight: 0,
        nodes: [
          { thumbnail: sikanaImage, id: '1' },
          { thumbnail: pbsImage, id: '2' },
          { thumbnail: oceanxImage, id: '3' },
          { thumbnail: tedxImage, id: '4' },
          // { thumbnail: khanImage, id: '5' },
          { thumbnail: commonImage, id: '6' },
        ],
      };
    },
    computed: {
      cardsPerRow: function() {
        return this.nodes.length;
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
      getButtonStyle(node) {
        return {
          width: `${this.buttonWidth}px`,
          height: `${this.buttonHeight}px`,
          backgroundImage: `url(${node.thumbnail}), linear-gradient(to bottom, rgba(185, 185, 185, 0.8), rgba(255, 255, 255, 0.3))`,
        };
      },
      onResize() {
        this.containerWidth = this.$refs.toolbar.$el.clientWidth;
      },
      updateImageWidth() {
        const width = window.innerWidth;
        let margin;
        if (width >= this.breakpoints['lg']) {
          margin = 30; // 2 * spacers[3]
        } else if (width < this.breakpoints['lg'] && width >= this.breakpoints['md']) {
          margin = 15; // 2 * spacers[2]
        } else if (width < this.breakpoints['md']) {
          margin = 7.5; // 2 * spacers[1]
        }
        this.buttonWidth = (this.containerWidth - this.cardsPerRow * margin) / this.cardsPerRow;
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
    flex-wrap: nowrap;
  }

  .demo-button {
    padding: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: all 300ms;

    &:hover {
      border-color: white;
      border-width: 3px;
      transform: scale(1.05);
    }
  }

</style>
