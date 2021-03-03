<template>

  <b-container fluid>
    <b-button-toolbar ref="toolbar" justify class="my-4">
      <b-button-group v-for="i in 5" :key="i">
        <b-button
          variant="outline-light"
          class="demo-button shadow-lg"
          :style="{
            width: `${buttonWidth}px`,
            height: `${buttonHeight}px`,
            backgroundImage: `url(${placeholder})`
          }"
        />
      </b-button-group>
    </b-button-toolbar>
  </b-container>

</template>


<script>

  import debounce from 'lodash/debounce';
  import placeholder from '../assets/placeholder.png';

  export default {
    name: 'ContentProvidersRow',
    data() {
      return {
        placeholder,
        breakpoints: {},
        containerWidth: 0,
        buttonWidth: 0,
        buttonHeight: 0,
      };
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
        style.getPropertyValue('--breakpoint-xs').replace('px', '')
      );
      this.breakpoints['sm'] = parseInt(
        style.getPropertyValue('--breakpoint-sm').replace('px', '')
      );
      this.breakpoints['md'] = parseInt(
        style.getPropertyValue('--breakpoint-md').replace('px', '')
      );
      this.breakpoints['lg'] = parseInt(
        style.getPropertyValue('--breakpoint-lg').replace('px', '')
      );
      this.breakpoints['xl'] = parseInt(
        style.getPropertyValue('--breakpoint-xl').replace('px', '')
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
      onResize() {
        this.containerWidth = this.$refs.toolbar.$el.clientWidth;
      },
      updateImageWidth() {
        const width = window.innerWidth;
        let margin;
        if (width >= this.breakpoints['lg']) {
          margin = 20;
        } else if (width < this.breakpoints['lg'] && width >= this.breakpoints['md']) {
          margin = 15;
        } else if (width < this.breakpoints['md']) {
          margin = 10;
        }
        this.buttonWidth = (this.containerWidth - 4 * margin) / 5;
        this.buttonHeight = this.buttonWidth / 1.7804; // aprox 600 / 337
      },
    },
  };

</script>


<style lang="scss" scoped>

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
