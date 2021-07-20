<template>
  <Header
    class="header"
    :style="{ backgroundImage: headerImageURL }"
    :showLogo="showLogo"
    @click-logo="goToChannelList"
  >
    <Breadcrumb v-if="notAtHome" :node="node" />
  </Header>
</template>

<script>
import { responsiveMixin } from 'eos-components';
import { mapState } from 'vuex';
import headerMixin from '@/components/mixins/headerMixin';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  mixins: [headerMixin, responsiveMixin],
  computed: {
    ...mapState(['content']),
    node() {
      if (this.content && Object.keys(this.content).length) {
        return this.content;
      }

      return this.section;
    },
    notAtHome() {
      return this.$route.name !== 'Home';
    },
    showLogo() {
      return !(this.xs && this.node.ancestors.length);
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
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
