<template>
  <b-row :noGutters="isHighQualityMedia">
    <b-col
      v-for="node in nodes"
      :key="node.id"
      :cols="cardColumns.cols"
      :md="cardColumns.md"
    >
      <Card :node="node" />
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'GridPage',
  props: {
    nodes: Array,
  },
  computed: {
    ...mapState(['cardColumns']),
    ...mapGetters(['isHighQualityMedia']),
  },
};
</script>
