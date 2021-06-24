<template>
  <Header
    class="header"
    :style="{ backgroundImage: headerImageURL }"
    @click-logo="goToChannelList"
  >
    <Breadcrumb :node="node" />
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
  background-color: $header-color;
  background-size: cover !important;
  background-repeat: no-repeat !important;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
