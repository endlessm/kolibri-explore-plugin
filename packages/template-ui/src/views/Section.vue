<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot></slot>
    <FilterContent />

    <div v-if="isFilterEmpty">
      <div v-if="isInlineLevel">
        <CardGrid
          v-for="subsection in section.children"
          :id="subsection.id"
          :key="subsection.id"
          :nodes="subsection.children"
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
          :nodes="section.children"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          variant="paginated"
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

export default {
  name: 'Section',
  computed: {
    ...mapState(['section', 'cardColumns', 'mediaQuality']),
    ...mapGetters({
      isInlineLevel: 'isInlineLevel',
      getAssetURL: 'getAssetURL',
      isFilterEmpty: 'filters/isEmpty',
    }),
    backgroundImageURL() {
      return this.getAssetURL('sectionBackgroundImage');
    },
  },
};
</script>
