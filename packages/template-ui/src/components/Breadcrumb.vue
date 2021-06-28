<template>
  <b-navbar-nav
    class="mt-3"
    aria-label="breadcrumb"
  >
    <ChannelLogo class="d-none d-sm-block mt-1" :channel="channel" size="sm" />
    <ol
      v-if="node.ancestors && node.ancestors.length"
      class="bg-transparent breadcrumb px-2"
    >
      <template v-if="xs || sm">
        <li v-if="node.ancestors.length > 1" class="active breadcrumb-item">
          ...
        </li>
        <li
          class="breadcrumb-item"
        >
          <b-link
            :to="getTopicUrl(parentNode)"
          >
            {{ parentNode.title }}
          </b-link>
        </li>
      </template>
      <template v-else>
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
      </template>
    </ol>
    <ol
      v-else
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
import { utils , responsiveMixin } from 'eos-components';
import { mapState } from 'vuex';


export default {
  name: 'Breadcrumb',
  mixins: [responsiveMixin],
  props: {
    node: Object,
  },
  computed: {
    ...mapState(['channel']),
    parentNode() {
      if (!this.node.ancestors || !this.node.ancestors.length) {
        return null;
      }
      return this.node.ancestors[this.node.ancestors.length-1];
    }
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
