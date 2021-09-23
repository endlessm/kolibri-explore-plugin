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

      <div v-if="isFilterEmpty">
        <b-container v-if="contentNodes.length && displayHeroContent">
          <CarouselCard
            v-for="node in contentNodes"
            :key="'node-' + node.id"
            :node="node"
            class="template-ui-hero-card"
            @click="goToContent(node)"
          />
        </b-container>
        <div v-else-if="contentNodes.length">
          <CardGrid
            :nodes="contentNodes"
            :variant="hasFlatGrid ? 'collapsible' : 'slidable'"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          />
        </div>
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
      </div>

      <div v-else>
        <FilterResult :node="section" />
      </div>

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
        return;
      }
      this.loadingCarouselNodes = true;
      if (this.carouselNodeIds.length) {
        window.kolibri.getContentByFilter({ ids: this.carouselNodeIds })
          .then((page) => {
            this.carouselNodes = page.results;
            this.loadingCarouselNodes = false;
          });
      }
      else {
        window.kolibri.getContentByFilter({
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
      return window.kolibri.getContentByFilter({ parent: 'self', onlyContent: true })
        .then((page) => {
          this.contentNodes = page.results;
          this.loadingContentNodes = false;
        });
    },
    fetchSectionNodes() {
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
