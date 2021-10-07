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
            v-for="subsection in sectionNodes"
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
            v-for="subsection in sectionNodes"
            :id="subsection.id"
            :key="subsection.id"
            :nodes="subsectionNodes[subsection.id].nodes"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
            :hasMoreNodes="subsectionNodes[subsection.id].hasMoreNodes"
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
          :nodes="sectionNodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          variant="collapsible"
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
      type: Array,
      default() {
        return [];
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  data() {
    return {
      subsectionNodes: {},
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
      return this.sectionNodes.every((n) => n.kind === 'topic');
    },
    backgroundImageURL() {
      return this.getAssetURL('sectionBackgroundImage');
    },
  },
  watch: {
    sectionNodes() {
      if (this.isInlineLevel) {
        this.fetchSubsectionNodes();
      }
    },
  },
  mounted() {
    if (this.isInlineLevel && this.sectionNodes.length) {
      this.fetchSubsectionNodes();
    }
  },
  methods: {
    fetchSubsectionNodes() {
      this.loadingSubsectionNodes = true;
      this.subsectionNodes = {};
      return Promise.all(this.sectionNodes.map((subsection) => {
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
  },
};
</script>
