<template>
  <component
    :is="cardVariant"
    :node="node"
    :subtitle="getCardSubtitle(node)"
    :url="getNodeUrl(node)"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { MediaQuality } from '@/constants';

export default {
  name: 'Card',
  props: {
    node: Object,
  },
  computed: {
    ...mapState(['mediaQuality']),
    ...mapGetters(['getCardSubtitle', 'getNodeUrl']),
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
  },
};
</script>
