<template>
  <div
    v-if="node.ancestors"
  >
    <b-link
      v-for="a in node.ancestors"
      :key="a.id"
      :to="getTopicUrl(a)"
    >
      <span><b-icon-arrow-left /> {{ a.title }} </span>
    </b-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['node'],
  computed: {
    ...mapGetters(['getNodeUrl']),
  },
  methods: {
    getTopicUrl(n) {
      return this.getNodeUrl({ id: n.id, kind: 'topic' });
    },
  },
};
</script>
