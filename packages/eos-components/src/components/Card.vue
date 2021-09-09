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
  data() {
    return {
      subtitle: '',
    };
  },
  watcn: {
    node: function() {
      this.updateSubtitle();
    },
  },
  computed: {
    cardVariant() {
      if (this.node.kind !== 'topic' || this.isBundle) {
        return 'ContentCard';
      }
      return 'TopicCard';
    },
    showAsBundle() {
      //FIXME check the children nodes to show as bundle:
      return false;
    },
    isBundle() {
      if ('isBundle' in this.node) {
        return this.node.isBundle;
      }
      // FIXME we shouldn't look at the store to check if this node represents a bundle.
      // Instead, we should traverse all nodes and add the isBundle flag above at load time.
      if (this.$store) {
        const { getters } = this.$store;
        if (getters.isSimpleBundle && this.showAsBundle) {
          return true;
        }
      }
      return false;
    },
  },
  mounted() {
    return new Promise((resolve) => {
      this.updateSubtitle();
      resolve();
    });
  },
  methods: {
    getNodeUrl,
    updateSubtitle: function() {
      let fallback = '';
      if (this.$store) {
        const { state } = this.$store;
        if (state.channel) {
          fallback = state.channel.title;
        }
      }
      this.subtitle = getCardSubtitle(this.node, fallback);
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
