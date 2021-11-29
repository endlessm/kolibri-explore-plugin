<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <ChannelHeader :section="section" />
    <FilterContent v-if="hasFilters" />

    <div v-if="isFilterEmpty">
      <div v-if="isInlineLevel">
        <template v-if="loadingSubsectionNodes">
          <CardGridPlaceholder
            v-for="subsection in sectionNodes.nodes"
            :id="subsection.id"
            :key="subsection.id"
          >
            <b-row>
              <SectionTitle :section="subsection" />
            </b-row>
          </CardGridPlaceholder>
        </template>
        <template v-else>
          <CardGrid
            v-for="subsection in sectionNodes.nodes"
            :id="subsection.id"
            :key="subsection.id"
            :nodes="getSubsectionNodes(subsection.id).nodes"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
            :hasMoreNodes="getSubsectionNodes(subsection.id).hasMoreNodes"
            @loadMoreNodes="onLoadMoreSubsectionNodes(subsection.id)"
          >
            <b-row>
              <SectionTitle :section="subsection" />
            </b-row>
          </CardGrid>
        </template>
      </div>
      <div v-else>
        <CardGrid
          :id="section.id"
          :key="section.id"
          :nodes="sectionNodes.nodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          variant="collapsible"
          :hasMoreNodes="sectionNodes.hasMoreNodes"
          @loadMoreNodes="$emit('loadMoreNodes')"
        />
      </div>
    </div>
    <div v-else>
      <FilterResult :node="section" />
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { constants } from 'eos-components';

const sectionPageSize = 2 * constants.ItemsPerSlide;

export default {
  name: 'ListSection',
  props: {
    section: {
      type: Object,
      required: true,
    },
    sectionNodes: {
      type: Object,
      default() {
        return { nodes: [], hasMoreNodes: null };
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  data() {
    return {
      subsectionNodes: { nodes: [], hasMoreNodes: null },
      loadingSubsectionNodes: true,
    };
  },
  computed: {
    ...mapState(['cardColumns', 'mediaQuality', 'hasFilters']),
    ...mapGetters({
      getAssetURL: 'getAssetURL',
      isFilterEmpty: 'filters/isEmpty',
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
      this.subsectionNodes = { nodes: [], hasMoreNodes: false };
      return Promise.all(this.sectionNodes.nodes.map((subsection) => {
        return window.kolibri.getContentByFilter({
          parent: subsection.id,
          maxResults: sectionPageSize,
        })
          .then((pageResult) => {
            this.$set(this.subsectionNodes, subsection.id, {
              nodes: pageResult.results,
              hasMoreNodes: pageResult.more,
            });
          });
      })).then(() => {
        this.loadingSubsectionNodes = false;
      });
    },
    onLoadMoreSubsectionNodes(sectionId) {
      const { nodes, hasMoreNodes } = this.subsectionNodes[sectionId];
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentPage({
        maxResults: sectionPageSize,
        cursor: hasMoreNodes.cursor,
      })
      .then((pageResult) => {
        this.$set(this.subsectionNodes, sectionId, {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more,
        });
      });
    },
    getSubsectionNodes(sectionId) {
      const subsection = this.subsectionNodes[sectionId];
      if (!subsection) {
        return { nodes: [], hasMoreNodes: null };
      }

      return subsection;
    },
  },
};
</script>
