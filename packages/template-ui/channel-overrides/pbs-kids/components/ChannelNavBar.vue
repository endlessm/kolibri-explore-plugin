<template>
  <Header
    class="header"
    :style="{ backgroundColor: headerColor }"
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
    ...mapState(['content', 'mainSection']),
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
    headerColor() {
      switch (this.mainSection.id) {
        // PreK - Kindergarten
        case '2d67696f13b64a7e9b74f45ab5ae6d97':
          return '#00bbf5';
        // Grades 1 - 2
        case '8799319da639424396425db62329be2b':
          return '#14c0b4';
        // Home:
        case undefined:
        default:
          return '#93cb00';
      }
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

img {
  box-shadow: $toast-box-shadow;
}

</style>
