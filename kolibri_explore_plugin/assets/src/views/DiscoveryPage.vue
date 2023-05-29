<template>

  <component :is="pageVariant" />

</template>


<script>

  import plugin_data from 'plugin_data';
  import DiscoveryPageContenPacks from './DiscoveryPageContenPacks';
  import DiscoveryPageEkIguana from './DiscoveryPageEkIguana';

  export default {
    name: 'DiscoveryPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: { DiscoveryPageContenPacks, DiscoveryPageEkIguana },
    computed: {
      pageVariant() {
        if (plugin_data.useEkIguanaPage) {
          return 'DiscoveryPageEkIguana';
        }
        return 'DiscoveryPageContenPacks';
      },
    },
    $trs: {
      documentTitle: 'Discovery',
    },
  };

</script>
