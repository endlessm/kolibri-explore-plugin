<template>

  <NavBar class="discovery-navbar">
    <img class="logo mr-3" :src="logo">
    <b-button-group class="mx-auto">
      <b-nav-text
        class="btn discovery-tab py-3 rounded-0 text-primary"
        :class="{ active: currentIsChannels() }"
        @click="goToChannels"
      >
        <ViewDashboardOutlineIcon />
        Channels
      </b-nav-text>
      <b-nav-text
        class="btn discovery-tab py-3 rounded-0 text-primary"
        :class="{ active: currentIsSearch() }"
        @click="goToSearch"
      >
        <MagnifyIcon />
        Search Keywords
      </b-nav-text>
    </b-button-group>
    <b-navbar-nav>
      <b-nav-text
        v-b-modal.about-modal
        class="btn d-md-block d-none pr-0"
      >
        About the Endless Key
      </b-nav-text>
    </b-navbar-nav>
  </NavBar>

</template>


<script>

  import ViewDashboardOutlineIcon from 'vue-material-design-icons/ViewDashboardOutline.vue';
  import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';

  import { mapMutations } from 'vuex';
  import { assets } from 'eos-components';
  import { PageNames } from '../constants';

  export default {
    name: 'DiscoveryNavBar',
    components: { ViewDashboardOutlineIcon, MagnifyIcon },
    computed: {
      logo() {
        return assets.EndlessLogo;
      },
    },
    methods: {
      ...mapMutations({
        setSearchResult: 'topicsRoot/SET_SEARCH_RESULT',
      }),
      goToChannels() {
        this.$router.push({
          name: PageNames.TOPICS_ROOT,
        });
      },
      goToSearch() {
        // cleaning previous search
        this.setSearchResult({}),
          this.$router.push({
            name: PageNames.SEARCH,
          });
      },
      currentIsChannels() {
        return this.$route.name === PageNames.TOPICS_ROOT;
      },
      currentIsSearch() {
        return this.$route.name === PageNames.SEARCH;
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

  .discovery-tab {
    &.active {
      border-bottom: 2px solid $primary;
    }
  }

  $logo-size: 50px;
  .logo {
    width: $logo-size;
  }

</style>