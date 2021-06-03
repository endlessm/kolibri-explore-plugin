<template>
  <div
    v-if="node.ancestors && node.ancestors.length"
  >
    <b-link
      v-for="a in node.ancestors"
      :key="a.id"
      :to="getTopicUrl(a)"
    >
      <span><b-icon-arrow-left /> {{ a.title }} </span>
    </b-link>
  </div>
  <div
    v-else-if="notAtHome"
  >
    <b-link
      :to="getNodeUrl(node)"
    >
      <span><b-icon-arrow-left /> {{ node.title }} </span>
    </b-link>
  </div>
</template>

<script>
import { utils } from 'eos-components';
import { mapState } from 'vuex';

export default {
  name: 'Breadcrumb',
  props: {
    node: Object,
  },
  computed: {
    ...mapState(['channel']),
    notAtHome() {
      return this.$route.name !== 'Home';
    },
  },
  methods: {
    getTopicUrl(n) {
      return utils.getNodeUrl({ id: n.id, kind: 'topic' }, this.channel.id);
    },
    getNodeUrl(n) {
      return utils.getNodeUrl(n, this.channel.id);
    },
  },
};
</script>
