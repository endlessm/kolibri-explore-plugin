<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot />
    <SectionsSearchRow />
    <Carousel />
    <FilterContent />

    <div v-if="isFilterResultEmpty">
      <EmptyResultsMessage />
    </div>

    <template v-else>
      <CardGrid
        :nodes="contentNodes"
        v-if="contentNodes"
      />
      <div
        v-for="section in filteredSections"
        :key="section.id"
      >
        <CardGrid
          v-if="filterNodes(section.children).length"
          :nodes="filterNodes(section.children)"
          :id="section.id"
        >
          <b-row>
            <SectionTitle :section="section" />
          </b-row>
        </CardGrid>
      </div>
    </template>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState(['channel', 'nodes', 'section']),
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
