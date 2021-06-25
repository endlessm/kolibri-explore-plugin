<template>
  <b-navbar v-scroll="onScroll" class="header" :class="{ shadow: hasScrolled }" fixed="top">
    <b-container class="px-3">
      <img class="logo" :src="logo" @click="$emit('click-logo')">
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
  // 2.27 is the AR of the endless logo
  $logo-height: $logo-size / 2.27;
  .logo {
    position: absolute;
    margin-left: - ($logo-size + 20px);
    margin-top: - ($logo-height / 2);
    top: 50%;

    width: $logo-size;
    cursor: pointer;
  }

</style>
