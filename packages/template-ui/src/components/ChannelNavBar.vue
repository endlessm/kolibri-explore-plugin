<template>
  <Header
    class="header"
    :style="{ backgroundImage: headerImageURL }"
    @click-logo="goToChannelList"
  >
    <Breadcrumb v-if="notAtHome" :node="node" />
  </Header>
</template>

<script>
import { mapState } from 'vuex';
import headerMixin from '@/components/mixins/headerMixin';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  mixins: [headerMixin],
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
