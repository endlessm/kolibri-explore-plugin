<template>
  <component
    :is="cardVariant"
    :node="node"
    :isBundle="isBundle"
    :url="getNodeUrl(node)"
    :mediaQuality="mediaQuality"
    @nodeUpdated="onNodeUpdated"
  />
</template>

<script>
import { MediaQuality } from '../constants';
import { getNodeUrl } from '../utils';

export default {
  name: 'EkCard',
  props: {
    node: {
      type: Object,
      required: true,
    },
    mediaQuality: {
      type: String,
      default: MediaQuality.REGULAR,
    },
  },
  computed: {
    cardVariant() {
      if (this.node.kind !== 'topic' || this.isBundle) {
        return 'EkContentCard';
      }
      return 'EkTopicCard';
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
  mounted() {
  },
  methods: {
    getNodeUrl,
    onNodeUpdated(nodeId) {
      this.$emit('nodeUpdated', nodeId);
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
