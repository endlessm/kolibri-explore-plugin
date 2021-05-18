<template>
  <component
    :is="cardVariant"
    :node="node"
  />
</template>

<script>
import { mapState } from 'vuex';
import { MediaQuality } from '@/constants';

export default {
  props: ['node'],
  computed: {
    ...mapState(['mediaQuality']),
    cardVariant() {
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
