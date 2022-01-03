<template>
  <NavBar
    class="channel-navbar"
    @click-logo="goToChannelList"
  >
    <a v-if="showClose" class="mr-3" @click="goToChannelList">X</a>
    <Breadcrumb v-if="!atHome" :node="node" />
  </NavBar>
</template>

<script>
import { mapState } from 'vuex';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
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
    ...mapState(['isStandaloneChannel']),
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

img {
  box-shadow: $toast-box-shadow;
}

</style>
