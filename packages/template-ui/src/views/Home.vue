<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot></slot>
    <SectionsSearchRow v-if="hasSectionsSearch" />

    <template v-if="loading">
      <CarouselPlaceholder v-if="hasCarousel" />
      <CardGridPlaceholder />
    </template>

    <template v-else>
      <Carousel v-if="hasCarousel" :nodes="carouselNodes" />
      <b-container v-if="hasCarousel">
        <hr>
      </b-container>
      <FilterContent v-if="hasFilters" />

      <div v-if="isFilterEmpty">
        <CardGrid
          v-if="contentNodes.length"
          :nodes="contentNodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
        />
        <div
          v-for="section in mainSections"
          :key="section.id"
        >
          <CardGrid
            :id="section.id"
            :nodes="section.children"
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
import _ from 'underscore';

export default {
  name: 'Home',
  computed: {
    ...mapState([
      'nodes',
      'carouselNodeIds',
      'carouselSlideNumber',
      'section',
      'loading',
      'cardColumns',
      'mediaQuality',
      'hasSectionsSearch',
      'hasCarousel',
      'hasFilters',
    ]),
    ...mapGetters({
      mainSections: 'mainSections',
      getAssetURL: 'getAssetURL',
      isFilterEmpty: 'filters/isEmpty',
    }),
    backgroundImageURL() {
      return this.getAssetURL('homeBackgroundImage');
    },
    contentNodes() {
      if (!this.section || !this.section.children) {
        return null;
      }
      return this.section.children.filter((n) => n.kind !== 'topic') || null;
    },
    carouselNodes() {
      if (this.carouselNodeIds.length) {
        return this.carouselNodesFixed(this.carouselNodeIds);
      }

      return this.carouselNodesRandom(this.carouselSlideNumber);
    },
  },
  methods: {
    carouselNodesRandom(n) {
      // Get n random nodes that are not topic:
      const possibleNodes = this.nodes.filter((node) => node.kind !== 'topic');
      return _.sample(possibleNodes, n);
    },
    carouselNodesFixed(nodeIds) {
      return nodeIds.map((n) => (
        this.nodes.find((m) => m.id === n.id)
      ));
    },
  },
};
</script>
