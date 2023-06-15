<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <ChannelNavBar :atHome="true" />
    <ChannelHeader />
    <SectionsSearchRow v-if="hasSectionsSearch" />

    <template v-if="loadingCarouselNodes">
      <EkCarouselPlaceholder v-if="hasCarousel" />
    </template>
    <template v-else>
      <EkCarousel v-if="hasCarousel" :nodes="carouselNodes" />
      <b-container v-if="hasCarousel">
        <hr>
      </b-container>
    </template>

    <template v-if="loadingContentNodes || loadingSectionNodes">
      <EkCardGridPlaceholder />
    </template>
    <template v-else>

      <b-container>
        <b-row alignH="between">
          <b-col>
            <b-form-checkbox v-model="hideUnavailableItems" name="check-only-downloaded" switch>
              Only downloaded items
            </b-form-checkbox>
          </b-col>

          <b-col v-if="hasFilters">
            <FilterContent />
          </b-col>
        </b-row>
      </b-container>

      <template v-if="isFilterEmpty">
        <template v-if="contentNodes.nodes.length">
          <EkCardGrid
            :nodes="contentNodes.nodes"
            :variant="hasFlatGrid ? 'collapsible' : 'slidable'"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
            :hasMoreNodes="contentNodes.hasMoreNodes"
            @loadMoreNodes="onLoadMoreContentNodes()"
          />
        </template>
        <div
          v-for="section in mainSections"
          :key="section.id"
        >
          <EkCardGrid
            v-if="sectionNodes[section.id].nodes.length"
            :id="section.id"
            :nodes="sectionNodes[section.id].nodes"
            :hasMoreNodes="sectionNodes[section.id].hasMoreNodes"
            :mediaQuality="mediaQuality"
            @loadMoreNodes="onLoadMoreSectionNodes(section.id)"
          >
            <SectionTitle :section="section" />
          </EkCardGrid>
        </div>
      </template>

      <template v-else>
        <FilterResult />
      </template>

    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { constants } from 'ek-components';

const sectionPageSize = 2 * constants.ItemsPerSlide.lg;

export default {
  name: 'Home',
  data() {
    return {
      carouselNodes: [],
      contentNodes: { nodes: [], hasMoreNodes: false, pagination: null },
      sectionNodes: {},
      loadingCarouselNodes: true,
      loadingContentNodes: true,
      loadingSectionNodes: true,
      hideUnavailableItems: window.kolibri.defaultHideUnavailable,
    };
  },
  computed: {
    ...mapState([
      'mainSections',
      'carouselNodeIds',
      'carouselSlideNumber',
      'carouselKinds',
      'cardColumns',
      'mediaQuality',
      'hasSectionsSearch',
      'hasCarousel',
      'hasFilters',
      'hasFlatGrid',
    ]),
    ...mapGetters({
      getAssetURL: 'getAssetURL',
      isFilterEmpty: 'filters/isEmpty',
    }),
    backgroundImageURL() {
      return this.getAssetURL('homeBackgroundImage');
    },
  },
  watch: {
    mainSections() {
      return this.fetchSectionNodes();
    },
    hideUnavailableItems() {
      return Promise.all([
        this.fetchCarouselNodes(),
        this.fetchContentNodes(),
        this.fetchSectionNodes(),
      ]);
    },
  },
  mounted() {
    return Promise.all([
      this.fetchCarouselNodes(),
      this.fetchContentNodes(),
      this.fetchSectionNodes(),
    ]);
  },
  methods: {
    fetchCarouselNodes() {
      if (!this.hasCarousel) {
        return null;
      }
      this.loadingCarouselNodes = true;
      if (this.carouselNodeIds.length) {
        return window.kolibri.getContentByFilter({
          ids: this.carouselNodeIds,
          includeUnavailable: !this.hideUnavailableItems,
        }).then((page) => {
            this.carouselNodes = page.results;
            this.loadingCarouselNodes = false;
          });
      }
      else {
        return window.kolibri.getRandomNodes({
          onlyContent: true,
          kinds: this.carouselKinds,
          maxResults: this.carouselSlideNumber,
        }).then((page) => {
          this.carouselNodes = page.results;
          this.loadingCarouselNodes = false;
        });
      }
    },
    fetchContentNodes() {
      this.loadingContentNodes = true;
      const options = this.hasFlatGrid ? { onlyContent: true } : { parent: 'self', onlyContent: true };
      return window.kolibri.getContentByFilter({
        ...options,
          maxResults: constants.ItemsPerPage,
          includeUnavailable: !this.hideUnavailableItems,
      })
        .then((pageResult) => {
          this.contentNodes = {
            nodes: pageResult.results,
            hasMoreNodes: pageResult.more !== null,
            pagination: pageResult.more,
          };
          this.loadingContentNodes = false;
        });
    },
    fetchSectionNodes() {
      if (this.hasFlatGrid) {
        this.loadingSectionNodes = false;
        return null;
      }
      this.loadingSectionNodes = true;
      this.sectionNodes = {};

      return Promise.all(this.mainSections.map((section) => {
        return window.kolibri.getContentByFilter({
            parent: section.id,
            maxResults: sectionPageSize,
            includeUnavailable: !this.hideUnavailableItems,
          })
          .then((pageResult) => {
            this.$set(this.sectionNodes, section.id, {
              nodes: pageResult.results,
              hasMoreNodes: pageResult.more !== null,
              pagination: pageResult.more,
            });
          });
      })).then(() => {
        this.loadingSectionNodes = false;
      });
    },
    onLoadMoreSectionNodes(sectionId) {
      const { nodes, hasMoreNodes, pagination } = this.sectionNodes[sectionId];
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentPage({
        ...pagination,
        ...(!this.hideUnavailableItems && { no_available_filtering: true }),
      }).then((pageResult) => {
        this.$set(this.sectionNodes, sectionId, {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more !== null,
          pagination: pageResult.more,
        });
      });
    },
    onLoadMoreContentNodes() {
      const { nodes, hasMoreNodes, pagination } = this.contentNodes;
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentPage({
        ...pagination,
        ...(!this.hideUnavailableItems && { no_available_filtering: true }),
      }).then((pageResult) => {
        this.contentNodes = {
          nodes: nodes.concat(pageResult.results),
          hasMoreNodes: pageResult.more !== null,
          pagination: pageResult.more,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

::v-deep .template-ui-hero-card {
  cursor: pointer;
  margin-bottom: 2rem;

  .subtitle {
    display: none;
  }
}

</style>
