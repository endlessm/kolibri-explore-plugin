<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <ChannelNavBar :atHome="true" />
    <ChannelHeader />
    <SectionsSearchRow v-if="hasSectionsSearch" />

    <template v-if="loadingCarouselNodes">
      <CarouselPlaceholder v-if="hasCarousel" />
    </template>
    <template v-else>
      <Carousel v-if="hasCarousel" :nodes="carouselNodes" />
      <b-container v-if="hasCarousel">
        <hr>
      </b-container>
    </template>

    <template v-if="loadingContentNodes || loadingSectionNodes">
      <CardGridPlaceholder />
    </template>
    <template v-else>
      <FilterContent v-if="hasFilters" />

      <template v-if="isFilterEmpty">
        <template v-if="contentNodes.nodes.length">
          <b-container v-if="displayHeroContent">
            <CarouselCard
              v-for="node in contentNodes.nodes"
              :key="'node-' + node.id"
              :node="node"
              class="template-ui-hero-card"
              @click="goToContent(node)"
            />
          </b-container>
          <CardGrid
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
          <CardGrid
            :id="section.id"
            :nodes="sectionNodes[section.id].nodes"
            :hasMoreNodes="sectionNodes[section.id].hasMoreNodes"
            :mediaQuality="mediaQuality"
            @loadMoreNodes="onLoadMoreSectionNodes(section.id)"
          >
            <b-row>
              <SectionTitle :section="section" />
            </b-row>
          </CardGrid>
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
import { constants } from 'eos-components';

const sectionPageSize = 2 * constants.ItemsPerSlide;

export default {
  name: 'Home',
  data() {
    return {
      carouselNodes: [],
      contentNodes: { nodes: [], hasMoreNodes: false },
      sectionNodes: {},
      loadingCarouselNodes: true,
      loadingContentNodes: true,
      loadingSectionNodes: true,
    };
  },
  computed: {
    ...mapState([
      'mainSections',
      'carouselNodeIds',
      'carouselSlideNumber',
      'cardColumns',
      'mediaQuality',
      'hasSectionsSearch',
      'hasCarousel',
      'hasFilters',
      'hasFlatGrid',
      'displayHeroContent',
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
        return window.kolibri.getContentByFilter({ ids: this.carouselNodeIds })
          .then((page) => {
            this.carouselNodes = page.results;
            this.loadingCarouselNodes = false;
          });
      }
      else {
        return window.kolibri.getContentByFilter({
          random: true,
          onlyContent: true,
          pageSize: this.carouselSlideNumber,
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
          page: 1,
          pageSize: constants.ItemsPerPage,
      })
        .then((pageResult) => {
          this.contentNodes = {
            nodes: pageResult.results,
            page: pageResult.page,
            hasMoreNodes: pageResult.page < pageResult.totalPages,
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
            page: 1,
            pageSize: sectionPageSize,
          })
          .then((pageResult) => {
            this.$set(this.sectionNodes, section.id, {
              nodes: pageResult.results,
              page: pageResult.page,
              hasMoreNodes: pageResult.page < pageResult.totalPages,
            });
          });
      })).then(() => {
        this.loadingSectionNodes = false;
      });
    },
    onLoadMoreSectionNodes(sectionId) {
      const { nodes, page, hasMoreNodes } = this.sectionNodes[sectionId];
      if (!hasMoreNodes) {
        return null;
      }
      return window.kolibri.getContentByFilter({
        parent: sectionId,
        page: page + 1,
        pageSize: sectionPageSize
      })
      .then((pageResult) => {
        this.$set(this.sectionNodes, sectionId, {
          nodes: nodes.concat(pageResult.results),
          page: pageResult.page,
          hasMoreNodes: pageResult.page < pageResult.totalPages,
        });
      });
    },
    onLoadMoreContentNodes() {
      const { nodes, page, hasMoreNodes } = this.contentNodes;
      if (!hasMoreNodes) {
        return null;
      }
      const options = this.hasFlatGrid ? { onlyContent: true } : { parent: 'self', onlyContent: true };
      return window.kolibri.getContentByFilter({
        ...options,
        page: page + 1,
        pageSize: constants.ItemsPerPage,
      })
      .then((pageResult) => {
        this.contentNodes = {
          nodes: nodes.concat(pageResult.results),
          page: pageResult.page,
          hasMoreNodes: pageResult.page < pageResult.totalPages,
        };
      });
    },
    goToContent(node) {
      window.kolibri.navigateTo(node.id);
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
