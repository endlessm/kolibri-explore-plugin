<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot></slot>
    <SectionsSearchRow />

    <div v-if="loading">
      <CarouselPlaceholder />
      <CardGridPlaceholder />
    </div>

    <div v-else>
      <Carousel />
      <FilterContent />

      <div v-if="isFilterResultEmpty">
        <EmptyResultsMessage />
      </div>

      <template v-else>
        <CardGrid
          v-if="contentNodes"
          :nodes="contentNodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
        />
        <div
          v-for="section in filteredSections"
          :key="section.id"
        >
          <CardGrid
            v-if="filterNodes(section.children).length"
            :id="section.id"
            :nodes="filterNodes(section.children)"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          >
            <b-row>
              <SectionTitle :section="section" />
            </b-row>
          </CardGrid>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState(['section', 'loading', 'cardColumns', 'mediaQuality']),
    ...mapGetters({
      mainSections: 'mainSections',
      getAssetURL: 'getAssetURL',
      filterNodes: 'filters/filterNodes',
    }),
    backgroundImageURL() {
      return this.getAssetURL('homeBackgroundImage');
    },
    contentNodes() {
      if (!this.section || !this.section.children) {
        return null;
      }
      const children = this.section.children.filter((n) => n.kind !== 'topic') || null;
      return this.filterNodes(children);
    },
    filteredSections() {
      return this.filterNodes(this.mainSections);
    },
    isFilterResultEmpty() {
      const isContentNodeEmpty = this.contentNodes === null || this.contentNodes.length === 0;
      const anySectionNode = this.filteredSections.some(
        (s) => (this.filterNodes(s.children).length),
      );
      return isContentNodeEmpty && !anySectionNode;
    },
  },
};
</script>
