<template>
  <b-navbar-nav
    v-if="(node.ancestors && node.ancestors.length) || notAtHome"
    class="mt-3"
    aria-label="breadcrumb"
  >
    <ChannelLogo class="mt-1" :channel="channel" size="sm" />
    <ol
      v-if="node.ancestors && node.ancestors.length"
      class="bg-transparent breadcrumb px-2"
    >
      <li
        v-for="a in node.ancestors"
        :key="a.id"
        class="breadcrumb-item"
      >
        <b-link
          :to="getTopicUrl(a)"
        >
          {{ a.title }}
        </b-link>
      </li>
    </ol>
    <ol
      v-else-if="notAtHome"
      class="bg-transparent breadcrumb px-2"
    >
      <li class="breadcrumb-item">
        <b-link
          :to="getNodeUrl(node)"
        >
          {{ node.title }}
        </b-link>
      </li>
    </ol>
  </b-navbar-nav>
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

<style lang="scss" scoped>
@import '@/styles.scss';

// .breadcrumb {
//  background-color: transparent;
// }

</style>
