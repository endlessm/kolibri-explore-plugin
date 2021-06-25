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
      <b-container>
        <hr>
      </b-container>
      <FilterContent />

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
  },
};
</script>
