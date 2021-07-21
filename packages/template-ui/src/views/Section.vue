<template>
  <component
    :is="sectionVariant"
  >
    <slot></slot>
  </component>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
};
</script>
