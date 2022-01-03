<template>
  <NavBar
    class="header"
    :style="{ backgroundImage: headerImageURL }"
    :class="{ 'has-image': hasHeaderImage }"
    :showLogo="showLogo"
    @click-logo="goToChannelList"
  >
    <Breadcrumb v-if="!atHome" :node="node" />
  </NavBar>
</template>

<script>
import { responsiveMixin } from 'eos-components';
import { mapState } from 'vuex';
import headerMixin from '@/components/mixins/headerMixin';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  mixins: [headerMixin, responsiveMixin],
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
    showLogo() {
      if (this.isStandaloneChannel) {
        return false;
      }
      return !(this.xs && this.node && this.node.ancestors.length);
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
