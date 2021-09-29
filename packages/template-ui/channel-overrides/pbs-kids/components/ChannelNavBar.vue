<template>
  <Header
    class="header"
    :style="{ backgroundColor: headerColor }"
    :showLogo="showLogo"
    @click-logo="goToChannelList"
  >
    <Breadcrumb v-if="!atHome" :node="node" />
  </Header>
</template>

<script>
import { responsiveMixin } from 'eos-components';
import headerMixin from '@/components/mixins/headerMixin';
import { goToChannelList } from 'kolibri-api';

export default {
  name: 'ChannelNavBar',
  mixins: [headerMixin, responsiveMixin],
  props: {
    node: Object,
    atHome: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    showLogo() {
      return !(this.xs && this.node.ancestors.length);
    },
    headerColor() {
      const defaultColor = '#93cb00';
      if (!this.node) {
        return defaultColor;
      }
      switch (this.node.id) {
        // PreK - Kindergarten
        case '2d67696f13b64a7e9b74f45ab5ae6d97':
          return '#00bbf5';
        // Grades 1 - 2
        case '8799319da639424396425db62329be2b':
          return '#14c0b4';
        // Home:
        case undefined:
        default:
          return defaultColor;
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
