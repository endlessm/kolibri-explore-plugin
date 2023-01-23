<template>

  <component :is="pageVariant" />

</template>


<script>

  import plugin_data from 'plugin_data';
  import DiscoveryPageCollections from './DiscoveryPageCollections';
  import DiscoveryPageFullContent from './DiscoveryPageFullContent';

  export default {
    name: 'DiscoveryPage',
    components: { DiscoveryPageCollections, DiscoveryPageFullContent },
    computed: {
      showCollectionsPage() {
        // FIXME return false if "use EK USB" was selected in the onboarding.
        return plugin_data.newCollectionsPageFeature;
      },
      pageVariant() {
        if (this.showCollectionsPage) {
          return 'DiscoveryPageCollections';
        }
        return 'DiscoveryPageFullContent';
      },
    },
  };

</script>
