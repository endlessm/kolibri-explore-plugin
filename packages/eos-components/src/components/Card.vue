<template>
  <component
    :is="cardVariant"
    :node="node"
    :subtitle="subtitle"
    :isBundle="isBundle"
    :url="getNodeUrl(node)"
  />
</template>

<script>
import { MediaQuality } from '../constants';
import { getNodeUrl, getCardSubtitle } from '../utils';

export default {
  name: 'Card',
  props: {
    node: Object,
    mediaQuality: String,
  },
  computed: {
    cardVariant() {
      if (this.node.kind === 'topic') {
        return 'TopicCard';
      }
      switch (this.mediaQuality) {
        case MediaQuality.HIGH:
          return 'HighResCard';
        case MediaQuality.LOW:
          return 'LowResCard';
        case MediaQuality.REGULAR:
        default:
          return 'RegularCard';
      }
    },
    subtitle() {
      let fallback = '';
      if (this.$store) {
        const { state } = this.$store;
        if (state.channel) {
          fallback = state.channel.title;
        }
      }
      return getCardSubtitle(this.node, fallback);
    },
    isBundle() {
      if (this.$store) {
        const { getters } = this.$store;
        if (getters.isSimpleBundle && getters.showAsBundle(this.node)) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    getNodeUrl,
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
