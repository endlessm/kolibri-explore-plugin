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
        <template v-if="contentNodes.length">
          <b-container v-if="displayHeroContent">
            <CarouselCard
              v-for="node in contentNodes"
              :key="'node-' + node.id"
              :node="node"
              class="template-ui-hero-card"
              @click="goToContent(node)"
            />
          </b-container>
          <CardGrid
            :nodes="contentNodes"
            :variant="hasFlatGrid ? 'collapsible' : 'slidable'"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          />
        </template>
        <div
          v-for="section in mainSections"
          :key="section.id"
        >
          <CardGrid
            :id="section.id"
            :nodes="sectionNodes[section.id]"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          >
            <b-row>
              <SectionTitle :section="section" />
            </b-row>
          </CardGrid>
        </div>
      </template>

      <template v-else>
        <FilterResult :node="section" />
      </template>

    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      carouselNodes: [],
      contentNodes: [],
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
      const options = this.hasFlatGrid ? { onlyContent: true } : { parent: 'self', onlyContent: true }
      return window.kolibri.getContentByFilter(options)
        .then((page) => {
          this.contentNodes = page.results;
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
        return window.kolibri.getContentByFilter({ parent: section.id })
          .then((page) => {
            this.sectionNodes[section.id] = page.results;
          });
      })).then(() => {
        this.loadingSectionNodes = false;
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
