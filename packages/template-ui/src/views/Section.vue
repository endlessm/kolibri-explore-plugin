<template>
  <component
    :is="sectionVariant"
  >
    <slot></slot>
  </component>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { trackEvent } from 'kolibri-api';
import ListSection from '@/views/ListSection';
import BundleSection from '@/views/BundleSection';

export default {
  name: 'Section',
  components: {
    ListSection,
    BundleSection,
  },
  computed: {
    ...mapState(['section']),
    ...mapGetters({
      isSimpleBundle: 'isSimpleBundle',
      showAsBundle: 'showAsBundle',
    }),
    sectionVariant() {
      if (this.showAsBundle(this.section) && this.isSimpleBundle) {
        return 'BundleSection';
      }
      return 'ListSection';
    },
  },
  mounted() {
    trackEvent('Section', 'load', this.section.id);
  },
  updated() {
    trackEvent('Section', 'load', this.section.id);
  },
};
</script>
