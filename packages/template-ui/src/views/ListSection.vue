<template>
  <div
    :style="{ backgroundImage: backgroundImageURL }"
  >
    <slot></slot>
    <FilterContent v-if="hasFilters" />

    <div v-if="isFilterEmpty">
      <div v-if="isInlineLevel">
        <CardGrid
          v-for="subsection in sectionNodes"
          :id="subsection.id"
          :key="subsection.id"
          :nodes="subsectionNodes[subsection.id]"
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
          :nodes="sectionNodes"
          :mediaQuality="mediaQuality"
          :cardColumns="cardColumns"
          variant="collapsible"
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
  name: 'ListSection',
  props: {
    section: Object,
    sectionNodes: {
      type: Array,
      default() {
        return [];
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  data() {
    return {
      subsectionNodes: {},
      loadingSubsectionNodes: true,
    };
  },
  computed: {
    ...mapState(['cardColumns', 'mediaQuality', 'hasFilters']),
    ...mapGetters({
      getAssetURL: 'getAssetURL',
      isFilterEmpty: 'filters/isEmpty',
    }),
    isInlineLevel() {
      return this.sectionNodes.every((n) => n.kind === 'topic');
    },
    backgroundImageURL() {
      return this.getAssetURL('sectionBackgroundImage');
    },
  },
  watch: {
    sectionNodes() {
      if (!this.isInlineLevel) {
        return;
      }
      return this.fetchSubsectionNodes();
    },
  },
  methods: {
    fetchSubsectionNodes() {
      this.loadingSubsectionNodes = true;
      this.subsectionNodes = {};
      return Promise.all(this.sectionNodes.map((subsection) => {
        return window.kolibri.getContentByFilter({ parent: subsection.id })
          .then((page) => {
            this.subsectionNodes[subsection.id] = page.results;
          });
      })).then(() => {
        this.loadingSubsectionNodes = false;
      });
    },
  },
};
</script>
