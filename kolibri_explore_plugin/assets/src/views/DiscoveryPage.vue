<template>

  <component :is="pageVariant" />

</template>


<script>

  import DiscoveryPageCollections from './DiscoveryPageCollections';
  import DiscoveryPageFullContent from './DiscoveryPageFullContent';

  export default {
    name: 'DiscoveryPage',
    components: { DiscoveryPageCollections, DiscoveryPageFullContent },
    computed: {
      showCollectionsPage() {
        // FIXME read this from a setting.
        return false;
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
