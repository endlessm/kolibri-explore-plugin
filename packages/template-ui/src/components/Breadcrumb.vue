<template>
  <b-navbar-nav
    class="mt-3"
    aria-label="breadcrumb"
  >
    <b-link
      class="d-none d-sm-block mt-2"
      to="/"
    >
      <ChannelLogo :channel="channel" size="sm" />
    </b-link>
    <ol
      v-if="node.ancestors && node.ancestors.length"
      class="bg-transparent breadcrumb flex-nowrap px-2"
    >
      <li v-if="isShortened" class="active breadcrumb-item">
        ...
      </li>
      <template v-if="xs || sm">
        <li
          class="breadcrumb-item text-truncate"
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
          v-for="a in node.ancestors.slice(-maxBreadcrumbs)"
          :key="a.id"
          class="breadcrumb-item text-truncate"
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
      <li class="breadcrumb-item text-truncate">
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
  data() {
    return {
      maxBreadcrumbs: 4,
    };
  },
  computed: {
    ...mapState(['channel']),
    parentNode() {
      if (!this.node.ancestors || !this.node.ancestors.length) {
        return null;
      }
      return this.node.ancestors[this.node.ancestors.length-1];
    },
    isShortened() {
      if (!this.node.ancestors || !this.node.ancestors.length) {
        return false;
      }
      return this.xs || this.sm || this.node.ancestors.length > this.maxBreadcrumbs;
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
