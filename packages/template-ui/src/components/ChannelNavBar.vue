<template>
  <NavBar
    class="header"
    :style="{ backgroundImage: headerImageURL }"
    :class="{ 'has-image': hasHeaderImage }"
    @click-logo="goToChannelList"
  >
    <a v-if="showClose" class="mr-3" @click="goToChannelList">X</a>
    <Breadcrumb v-if="!atHome" :node="node" />
  </NavBar>
</template>

<script>
import { mapState } from 'vuex';
import headerMixin from '@/components/mixins/headerMixin';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  mixins: [headerMixin],
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

.header {
  @include navbar-background($header-height);
  &.has-image {
    background-color: $primary;
  }
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
