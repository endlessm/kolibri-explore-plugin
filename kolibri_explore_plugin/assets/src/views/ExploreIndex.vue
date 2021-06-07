<template>

  <div>
    <component :is="currentPage" v-if="currentPage" />
    <router-view />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import { PageNames } from '../constants';
  import commonExploreStrings from './commonExploreStrings';
  import ChannelsPage from './ChannelsPage';
  import CustomChannelsPage from './CustomChannelsPage';
  import ContentPage from './ContentPage';
  import ContentUnavailablePage from './ContentUnavailablePage';
  import SearchPage from './SearchPage';

  const pageNameToComponentMap = {
    [PageNames.TOPICS_ROOT]: ChannelsPage,
    [PageNames.TOPICS_CHANNEL]: CustomChannelsPage,
    [PageNames.TOPICS_TOPIC]: CustomChannelsPage,
    [PageNames.TOPICS_CONTENT]: ContentPage,
    [PageNames.CONTENT_UNAVAILABLE]: ContentUnavailablePage,
    [PageNames.SEARCH]: SearchPage,
  };

  export default {
    name: 'ExploreIndex',
    mixins: [commonCoreStrings, commonExploreStrings, responsiveWindowMixin],
    data() {
      return {
        lastRoute: null,
      };
    },
    computed: {
      ...mapState(['pageName']),
      currentPage() {
        return pageNameToComponentMap[this.pageName] || null;
      },
    },
    watch: {
      $route: function(newRoute, oldRoute) {
        // Return if the user is leaving or entering the Search page.
        // This ensures we never set this.lastRoute to be any kind of
        // SEARCH route and avoids infinite loops.
        if (newRoute.name === 'SEARCH' || oldRoute.name === 'SEARCH') {
          return;
        }

        // Destructure the oldRoute into an object with 3 specific properties.
        // Setting this.lastRoute = oldRoute causes issues for some reason.
        this.lastRoute = {
          name: oldRoute.name,
          query: oldRoute.query,
          params: oldRoute.params,
        };
      },
    },
  };

</script>


<style lang="scss">

  /** Non scoped styles to be able to modify body css to fix the footer to the bottom **/
  body,
  body > div {
    height: 100%;
  }

</style>
