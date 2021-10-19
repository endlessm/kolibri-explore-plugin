<template>
  <div>
    <ChannelNavBar :node="section" />
    <component
      :is="sectionVariant"
      :section="section"
      :sectionNodes="sectionNodes"
      :loading="loading"
      @loadMoreNodes="onLoadMoreSectionNodes()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ListSection from '@/views/ListSection';
import BundleSection from '@/views/BundleSection';
import { constants } from 'eos-components';

export default {
  name: 'Section',
  components: {
    ListSection,
    BundleSection,
  },
  data() {
    return {
      section: {},
      sectionNodes: { nodes: [], hasMoreNodes: false },
      loading: true,
    };
  },
  computed: {
    ...mapGetters([
      'isSimpleBundle',
    ]),
    showAsBundle() {
      if (!this.isSimpleBundle) {
        return false;
      }
      return this.node.topic_children_count === 0;
    },
    sectionVariant() {
      if (this.showAsBundle) {
        return 'BundleSection';
      }
      return 'ListSection';
    },
  },
  watch: {
    $route() {
      return this.fetchAll();
    },
  },
  mounted() {
    return this.fetchAll();
  },
  methods: {
    fetchAll() {
      this.loading = true;
      const { topicId } = this.$route.params;
      return window.kolibri.getContentById(topicId)
        .then((section) => {
          this.section = section;
          return this.fetchSectionNodes();
        })
        .then(() => {
          this.loading = false;
        });
    },
    fetchSectionNodes() {
      return window.kolibri.getContentByFilter({
        parent: this.section.id,
        maxResults: constants.ItemsPerPage,
      })
        .then((pageResult) => {
          this.sectionNodes = {
            nodes: pageResult.results,
            hasMoreNodes: pageResult.more,
          };
        });
    },
    onLoadMoreSectionNodes() {
      const { nodes, hasMoreNodes } = this.sectionNodes;
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentByFilter({
        parent: this.section.id,
        cursor: hasMoreNodes.cursor,
        maxResults: constants.ItemsPerPage,
      })
      .then((pageResult) => {
        this.sectionNodes = {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more,
        };
      });
    },
  },
};
</script>
