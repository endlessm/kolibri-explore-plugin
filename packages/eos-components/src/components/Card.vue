<template>
  <component
    :is="cardVariant"
    :node="node"
    :subtitle="subtitle"
    :isBundle="isBundle"
    :url="getNodeUrl(node)"
    :mediaQuality="mediaQuality"
  />
</template>

<script>
import { getNodeUrl, getCardSubtitle } from '../utils';

export default {
  name: 'Card',
  props: {
    node: Object,
    mediaQuality: String,
  },
  computed: {
    cardVariant() {
      if (this.node.kind !== 'topic' || this.isBundle) {
        return 'ContentCard';
      }
      return 'TopicCard';
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
      if ('isBundle' in this.node) {
        return this.node.isBundle;
      }
      // FIXME we shouldn't look at the store to check if this node represents a bundle.
      // Instead, we should traverse all nodes and add the isBundle flag above at load time.
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
