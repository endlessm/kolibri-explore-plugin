<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <ChannelHeader :section="section" />

    <div v-if="isInlineLevel">
      <template v-if="loadingSubsectionNodes">
        <EkCardGridPlaceholder
          v-for="subsection in sectionNodes.nodes"
          :id="subsection.id"
          :key="subsection.id"
        >
          <SectionTitle :section="subsection" />
        </EkCardGridPlaceholder>
      </template>
      <template v-else>
        <EkCardGrid
          v-for="subsection in sectionNodes.nodes"
          :id="subsection.id"
          :key="subsection.id"
          :nodes="getSubsectionNodes(subsection.id).nodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          :hasMoreNodes="getSubsectionNodes(subsection.id).hasMoreNodes"
          @loadMoreNodes="onLoadMoreSubsectionNodes(subsection.id)"
          @nodeUpdated="onSubsectionNodeUpdated(subsection.id, ...arguments)"
        >
          <SectionTitle :section="subsection" />
        </EkCardGrid>
      </template>
    </div>
    <div v-else>
      <EkCardGrid
        :id="section.id"
        :key="section.id"
        :nodes="sectionNodes.nodes"
        :mediaQuality="mediaQuality"
        :cardColumns="cardColumns"
        variant="collapsible"
        :hasMoreNodes="sectionNodes.hasMoreNodes"
        @loadMoreNodes="$emit('loadMoreNodes')"
        @nodeUpdated="(nodeId) => $emit('nodeUpdated', nodeId)"
      />
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { constants } from 'ek-components';
import updateNodeMixin from '@/mixins/updateNodeMixin';

const sectionPageSize = 2 * constants.ItemsPerSlide.lg;

export default {
  name: 'ListSection',
  mixins: [updateNodeMixin],
  props: {
    section: {
      type: Object,
      required: true,
    },
    sectionNodes: {
      type: Object,
      default() {
        return { nodes: [], hasMoreNodes: false, cursor: null };
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  data() {
    return {
      subsectionNodes: { nodes: [], hasMoreNodes: false, pagination: null },
      loadingSubsectionNodes: true,
    };
  },
  computed: {
    ...mapState(['cardColumns', 'mediaQuality']),
    ...mapGetters({
      getAssetURL: 'getAssetURL',
    }),
    isInlineLevel() {
      // FIXME: Use API to query the amount of subtopics:
      return this.sectionNodes.nodes.every((n) => n.kind === 'topic');
    },
    backgroundImageURL() {
      return this.getAssetURL('sectionBackgroundImage');
    },
  },
  watch: {
    sectionNodes() {
      if (this.isInlineLevel) {
        this.loadInlineLevel();
      }
    },
  },
  mounted() {
    if (this.isInlineLevel) {
      this.loadInlineLevel();
    }
  },
  methods: {
    loadInlineLevel() {
      // Load all nodes pages if it's an inline level
      if (this.sectionNodes.hasMoreNodes) {
        this.$emit('loadMoreNodes');
      }
      else if (this.sectionNodes.nodes.length) {
        this.fetchSubsectionNodes();
      }
    },
    fetchSubsectionNodes() {
      this.loadingSubsectionNodes = true;
      this.subsectionNodes = { nodes: [], hasMoreNodes: false, pagination: null };
      return Promise.all(this.sectionNodes.nodes.map((subsection) => {
        return window.kolibri.getContentByFilter({
          parent: subsection.id,
          maxResults: sectionPageSize,
        })
          .then((pageResult) => {
            this.$set(this.subsectionNodes, subsection.id, {
              nodes: pageResult.results,
              hasMoreNodes: pageResult.more !== null,
              pagination: pageResult.more,
            });
          });
      })).then(() => {
        this.loadingSubsectionNodes = false;
      });
    },
    onLoadMoreSubsectionNodes(sectionId) {
      const { nodes, pagination, hasMoreNodes } = this.subsectionNodes[sectionId];
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentPage(pagination).then((pageResult) => {
        this.$set(this.subsectionNodes, sectionId, {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more !== null,
          pagination: pageResult.more,
        });
      });
    },
    getSubsectionNodes(sectionId) {
      const subsection = this.subsectionNodes[sectionId];
      if (!subsection) {
        return { nodes: [], hasMoreNodes: false, pagination: null};
      }

      return subsection;
    },
    onSubsectionNodeUpdated(sectionId, nodeId) {
      return this.onNodeUpdated(nodeId, this.subsectionNodes[sectionId].nodes);
    },
  },
};
</script>
