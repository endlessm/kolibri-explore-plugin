<template>
  <div>
    <ChannelNavBar :node="section" />
    <component
      :is="sectionVariant"
      :section="section"
      :sectionNodes="sectionNodes"
      :loading="loading"
      @loadMoreNodes="onLoadMoreSectionNodes"
      @nodeUpdated="onSectionNodeUpdated"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { constants } from 'ek-components';
import ListSection from '@/views/ListSection';
import BundleSection from '@/views/BundleSection';
import updateNodeMixin from '@/mixins/updateNodeMixin';

export default {
  name: 'Section',
  components: {
    ListSection,
    BundleSection,
  },
  mixins: [updateNodeMixin],
  data() {
    return {
      section: {},
      sectionNodes: { nodes: [], hasMoreNodes: false, pagination: null },
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
      // FIXME: Use API to query the amount of subtopics:
      const { nodes } = this.sectionNodes;
      const hasChildTopics = nodes.some((n) => n.kind === 'topic');
      return !hasChildTopics;
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
            hasMoreNodes: pageResult.more !== null,
            pagination: pageResult.more,
          };
        });
    },
    onLoadMoreSectionNodes() {
      const { nodes, hasMoreNodes, pagination } = this.sectionNodes;
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentPage(pagination).then((pageResult) => {
        this.sectionNodes = {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more !== null,
          pagination: pageResult.more,
        };
      });
    },
    onSectionNodeUpdated(nodeId) {
      return this.onNodeUpdated(nodeId, this.sectionNodes.nodes);
    },
  },
};
</script>
