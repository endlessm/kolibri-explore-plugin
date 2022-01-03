<template>
  <b-navbar class="navbar px-0" :class="{ shadow: hasScrolled }" fixed="top">
    <b-container fluid class="mx-3">
      <slot></slot>
      <b-navbar-nav class="ml-auto">
        <slot name="right"></slot>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
  import _ from 'underscore';

  export default {
    name: 'NavBar',
    data() {
      return {
        hasScrolled: false,
      };
    },
    created() {
      this.debouncedScroll = _.debounce(this.onScroll, 100);
      window.addEventListener('scroll', this.debouncedScroll);
    },
    destroyed() {
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
    & .container {
      padding-right: $grid-gutter-width / 2;
      padding-left: $grid-gutter-width / 2;
    }
  }

</style>
