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
    section: Object,
    sectionNodes: {
      type: Object,
      default() {
        return { nodes: [], hasMoreNodes: false };
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  data() {
    return {
      subsectionNodes: { nodes: [], hasMoreNodes: false },
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
      return this.section.children_count === this.section.topic_children_count;
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
          page: 1,
          pageSize: sectionPageSize,
        })
          .then((pageResult) => {
            this.$set(this.subsectionNodes, subsection.id, {
              nodes: pageResult.results,
              page: pageResult.page,
              hasMoreNodes: pageResult.page < pageResult.totalPages,
            });
          });
      })).then(() => {
        this.loadingSubsectionNodes = false;
      });
    },
    onLoadMoreSubsectionNodes(sectionId) {
      const { nodes, page, hasMoreNodes } = this.subsectionNodes[sectionId];
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentByFilter({
        parent: sectionId,
        page: page + 1,
        pageSize: sectionPageSize
      })
      .then((pageResult) => {
        this.$set(this.subsectionNodes, sectionId, {
          nodes: nodes.concat(pageResult.results),
          page: pageResult.page,
          hasMoreNodes: pageResult.page < pageResult.totalPages,
        });
      });
    },
    getSubsectionNodes(sectionId) {
      const subsection = this.subsectionNodes[sectionId];
      if (!subsection) {
        return { nodes: [], hasMoreNodes: false };
      }

      return subsection;
    },
  },
};
</script>
