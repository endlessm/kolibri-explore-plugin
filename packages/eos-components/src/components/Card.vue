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
  computed: {
    cardVariant() {
      if (this.node.kind !== 'topic' || this.isBundle) {
        return 'ContentCard';
      }
      return 'TopicCard';
    },
    showAsBundle() {
      // If there are no topics children we can show as bundle
      return this.node.topic_children_count === 0;
    },
    isBundle() {
      if ('isBundle' in this.node) {
        return this.node.isBundle;
      }
      if (this.isSimpleBundle && this.showAsBundle) {
        return true;
      }
      return false;
    },
    isSimpleBundle() {
      if (this.$store) {
        const { getters } = this.$store;
        return getters.isSimpleBundle;
      }
      return false;
    },
  },
  watch: {
    node() {
      this.updateSubtitle();
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
