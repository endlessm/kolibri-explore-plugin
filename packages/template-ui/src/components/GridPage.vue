<template>
  <b-row :no-gutters="isHighQualityMedia">
    <b-col
      :cols="cardColumns.cols"
      :md="cardColumns.md"
      v-for="node in nodes"
      :key="node.id"
    >
      <Card :node="node" />
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'GridPage',
  props: ['nodes'],
  computed: {
    ...mapState(['cardColumns']),
    ...mapGetters(['isHighQualityMedia']),
  },
};
</script>
