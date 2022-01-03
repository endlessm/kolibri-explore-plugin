<template>
  <b-navbar class="navbar px-0" :class="{ shadow: hasScrolled }" fixed="top">
    <b-container fluid class="mx-3">
      <img v-if="showLogo" class="logo mr-3" :src="logo" @click="$emit('click-logo')">
      <slot></slot>

      <b-navbar-nav class="ml-auto">
        <slot name="right"></slot>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
  import _ from 'underscore';
  import EndlessLogo from '../assets/EndlessLogo.svg';

  export default {
    name: 'NavBar',
    props: {
      showLogo: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        hasScrolled: false,
      };
    },
    computed: {
      logo() {
        return EndlessLogo;
      },
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

  $logo-size: 50px;
  .logo {
    width: $logo-size;
    cursor: pointer;
  }

</style>
