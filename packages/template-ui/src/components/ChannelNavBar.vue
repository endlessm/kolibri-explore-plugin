<template>
  <NavBar
    alwaysCastShadow
    class="channel-navbar"
  >
    <a v-if="showClose" class="close-link mr-3" @click="goToChannelList">
      <CloseIcon />
    </a>
    <template v-if="!atHome">
      <b-navbar-nav
        class="mt-3"
        aria-label="breadcrumb"
      >
        <b-link
          class="d-none d-sm-block mt-2"
          :to="{ name: 'Home', query: { clearFilters: true } }"
        >
          <ChannelLogo :channel="channel" size="sm" />
        </b-link>
        <Breadcrumb :node="node" />
      </b-navbar-nav>
    </template>
  </NavBar>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue';
import { mapState } from 'vuex';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  components: {
    CloseIcon,
  },
  props: {
    node: {
      type: Object,
      default: null,
    },
    atHome: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['channel', 'isStandaloneChannel']),
    showClose() {
      return !this.isStandaloneChannel;
    },
  },
  methods: {
    goToChannelList() {
      goToChannelList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.channel-navbar {
  background-color: $gray-700;
}

.close-link {
  color: $gray-500;
  cursor: pointer;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
