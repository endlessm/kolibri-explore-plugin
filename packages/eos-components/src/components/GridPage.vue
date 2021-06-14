<template>
  <b-row :noGutters="isHighQualityMedia">
    <b-col
      v-for="node in nodes"
      :key="node.id"
      :cols="cardColumns.cols"
      :md="cardColumns.md"
      :lg="cardColumns.lg"
    >
      <Card :node="node" :mediaQuality="mediaQuality" />
    </b-col>
  </b-row>
</template>

<script>
import { MediaQuality } from '../constants';

export default {
  name: 'GridPage',
  props: {
    nodes: Array,
    mediaQuality: String,
    cardColumns: Object,
  },
  computed: {
    isHighQualityMedia() {
      return this.mediaQuality === MediaQuality.HIGH;
    },
  },
};
</script>

<style lang="scss" scoped>

  @import '../styles.scss';

</style>
