<template>
  <b-navbar class="navbar px-0" :class="{ shadow: castShadow }" fixed="top">
    <b-container fluid class="justify-content-start mx-3">
      <slot></slot>
    </b-container>
  </b-navbar>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'EkNavBar',
    props: {
      alwaysCastShadow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        hasScrolled: false,
      };
    },
    computed: {
      castShadow() {
        return this.alwaysCastShadow || this.hasScrolled;
      },
    },
    created() {
      if (this.alwaysCastShadow) {
        return;
      }
      this.debouncedScroll = _.debounce(this.onScroll, 100);
      window.addEventListener('scroll', this.debouncedScroll);
    },
    destroyed() {
      if (this.alwaysCastShadow) {
        return;
      }
      window.removeEventListener('scroll', this.debouncedScroll);
    },
    methods: {
      onScroll() {
        this.hasScrolled = window.scrollY !== 0;
      },
    },
  }
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

  .navbar {
    height: $navbar-height;
    @include transition($btn-transition);

    &.fixed-top {
      /* Override excessively high z-index from .fixed-top. A value of 8 is
       * used for Kolibri's AppBar component. */
      z-index: 8;
    }
  }

</style>
