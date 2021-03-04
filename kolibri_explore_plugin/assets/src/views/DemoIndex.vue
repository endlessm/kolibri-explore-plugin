<template>

  <div>
    <Header />
    <b-container fluid>
      <Carousel />
    </b-container>
    <ContentProvidersRow />
    <TagRow label="Sports" />
    <TagRow label="Nature" />
    <TagRow label="Health" />
    <TagRow label="Art" />
    <TagRow label="DIY" />
    <b-container fluid>
      <Footer />
    </b-container>
  </div>

</template>


<script>

  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import Header from '../components/Header';
  import Carousel from '../components/Carousel';
  import ContentProvidersRow from '../components/ContentProvidersRow';
  import TagRow from '../components/TagRow';
  import Footer from '../components/Footer';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'DemoIndex',
    components: {
      Header,
      Carousel,
      ContentProvidersRow,
      TagRow,
      Footer,
    },
    mixins: [commonCoreStrings, commonExploreStrings, responsiveWindowMixin],
    data() {
      return {
        lastRoute: null,
      };
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


<style lang="scss" scoped>

  @import './explore';

</style>
