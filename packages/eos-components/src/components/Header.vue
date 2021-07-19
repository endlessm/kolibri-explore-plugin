<template>
  <b-navbar class="header" :class="{ shadow: hasScrolled }" fixed="top">
    <b-container class="px-3">
      <img v-if="showLogo" class="logo" :src="logo" @click="$emit('click-logo')">
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
    name: 'Header',
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

  .header {
    background: white;
    height: $navbar-height;
    @include transition($btn-transition);
  }

  .header > .container {
    padding: $card-spacer-x;
  }

  $logo-size: 50px;
  .logo {
    margin-right: $spacer;
    width: $logo-size;
    cursor: pointer;
  }

</style>
