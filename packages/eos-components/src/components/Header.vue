<template>
  <b-navbar class="header" sticky>
    <b-container>
      <img class="logo" :src="logo" @click="$emit('click-logo')">
      <slot></slot>

      <b-navbar-nav class="ml-auto">
        <slot name="right"></slot>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
  import EndlessLogo from '../assets/EndlessLogo.svg';

  export default {
    name: 'Header',
    computed: {
      logo() {
        return EndlessLogo;
      },
    },
  }
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

  .header {
    background: white;
  }

  .header > .container {
    padding: $card-spacer-x;
  }

  $logo-size: 50px;
  .logo {
    position: absolute;
    margin-left: - ($logo-size + 20px);
    width: $logo-size;
    cursor: pointer;
  }

</style>
