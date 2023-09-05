<template>
  <ol
    class="bg-transparent breadcrumb flex-nowrap px-2"
  >
    <template v-if="showParentsInBreadcrumb">
      <!-- Possible … li for small screens or too many parents -->
      <li
        v-if="isShortened"
        class="breadcrumb-item"
      >
        …
      </li>
      <!-- One li with link per parent item -->
      <li
        v-for="p in parentItems"
        :key="p.id"
        v-b-tooltip.hover
        :title="p.title"
        class="breadcrumb-item text-light text-truncate"
      >
        <b-link
          :to="getTopicUrl(p)"
        >
          {{ p.title }}
        </b-link>
      </li>
    </template>
    <!-- Last li, current node or Search -->
    <li
      v-b-tooltip.hover
      :title="currentItem.title"
      class="active breadcrumb-item text-light text-truncate"
    >
      {{ currentItem.title }}
    </li>
  </ol>
</template>

<script>
import { utils, responsiveMixin } from 'ek-components';
import { mapState } from 'vuex';


export default {
  name: 'Breadcrumb',
  mixins: [responsiveMixin],
  props: {
    node: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      maxBreadcrumbs: 4,
    };
  },
  computed: {
    ...mapState(['channel', 'showParentsInBreadcrumb']),
    isShortened() {
      if (!this.node || !this.node.ancestors || this.node.ancestors.length < 2) {
        // No … for the Search page or for main topics:
        return false;
      }
      // Display … in small screens or if there are too many parents:
      return this.xs || this.sm || this.node.ancestors.length > this.maxBreadcrumbs;
    },
    isSearchPageCurrent() {
      // We assume that when no node is passed, the Search page is current:
      return !this.node;
    },
    parentItems() {
      // Only the channel as parent in Search page:
      if (this.isSearchPageCurrent) {
        return [{
          "id": this.channel.id,
          "title": this.channel.name,
          "to": { name: 'Home', query: { clearFilters: true } },
        }];
      }

      // There has to be a node with a parent to continue:
      if (!this.node || !this.node.ancestors || this.node.ancestors.length < 1) {
        return [];
      }

      // Only the last parent in small screens:
      if (this.xs || this.sm) {
        return [this.node.ancestors[this.node.ancestors.length-1]];
      }

      else {
        return this.node.ancestors.slice(-this.maxBreadcrumbs);
      }
    },
    currentItem() {
      if (this.isSearchPageCurrent) {
        return { "title": this.$tr('searchKeywords') };
      }
      return this.node;
    },
  },
  methods: {
    getTopicUrl(n) {
      const path = utils.getNodeUrl({ id: n.id, kind: 'topic' }, this.channel.id);
      return {
        path,
        query: { clearFilters: path === '/' },
      };
    },
  },
  $trs: {
    searchKeywords: {
      message: 'Search Keywords',
      context: 'Breadcrumb used when the user has performed a search',
    },
  },
};
</script>
