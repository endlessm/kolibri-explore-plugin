<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot></slot>
    <FilterContent />

    <div v-if="isFilterResultEmpty">
      <EmptyResultsMessage />
    </div>

    <template v-else>

      <div v-if="isInlineLevel">
        <CardGrid
          v-for="subsection in filteredSections(section)"
          :id="subsection.id"
          :key="subsection.id"
          :nodes="filteredSections(subsection)"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
        >
          <b-row>
            <SectionTitle :section="subsection" />
          </b-row>
        </CardGrid>
      </div>
      <div v-else>
        <CardGrid
          :id="section.id"
          :key="section.id"
          :nodes="filteredSections(section)"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          variant="paginated"
        />
      </div>

    </template>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Section',
  computed: {
    ...mapState(['section', 'cardColumns', 'mediaQuality']),
    ...mapGetters({
      isInlineLevel: 'isInlineLevel',
      getAssetURL: 'getAssetURL',
      filterNodes: 'filters/filterNodes',
    }),
    backgroundImageURL() {
      return this.getAssetURL('sectionBackgroundImage');
    },
    isFilterResultEmpty() {
      if (!this.section) {
        return true;
      }
      return this.filteredSections(this.section).length === 0;
    },
  },
  methods: {
    filteredSections(section) {
      return this.filterNodes(section.children);
    },
  },
};
</script>
