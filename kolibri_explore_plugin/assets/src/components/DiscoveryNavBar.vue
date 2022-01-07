<template>

  <NavBar class="discovery-navbar">
    <img class="logo mr-3" :src="logo">
    <b-button-group>
      <b-nav-text class="btn pl-0 text-primary" @click="goBack">
        Channels
      </b-nav-text>
      <b-nav-text class="btn pl-0 text-primary" @click="goToSearch">
        Search Keywords
      </b-nav-text>
    </b-button-group>

    <template #right>
      <b-nav-text
        v-b-modal.about-modal
        class="btn d-md-block d-none pl-0"
      >
        About the Endless Key
      </b-nav-text>
    </template>
  </NavBar>

</template>


<script>

  import { assets } from 'eos-components';
  import { PageNames } from '../constants';

  export default {
    name: 'DiscoveryNavBar',
    computed: {
      logo() {
        return assets.EndlessLogo;
      },
    },
    methods: {
      goBack() {
        this.$router.push({
          name: PageNames.TOPICS_ROOT,
        });
      },
      goToSearch() {
        this.$router.push({
          name: PageNames.SEARCH,
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .discovery-navbar {
    background: $gray-300;
    border-bottom: 1px solid $gray-400;
  }

  $logo-size: 50px;
  .logo {
    width: $logo-size;
  }

</style>
