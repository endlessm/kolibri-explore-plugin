<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <DiscoveryNavBar />

    <b-container class="mb-2 mt-4">
      <h5 class="mt-2 text-muted">
        WIP PAGE
      </h5>
      <template v-if="loading">
        <p>Loading...</p>
      </template>
    </b-container>

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  import DiscoveryNavBar from '../components/DiscoveryNavBar';

  export default {
    name: 'DiscoveryPageCollections',
    components: { DiscoveryNavBar },
    mixins: [commonCoreStrings],
    computed: {
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .channels-page {
    padding-top: $navbar-height;
  }

</style>
