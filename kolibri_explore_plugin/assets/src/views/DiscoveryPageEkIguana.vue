<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <DiscoveryNavBar />

    <b-container class="mb-2 mt-4">
      <h5 class="mt-2 text-muted">
        {{ $tr('contentSuggestionsHeading') }}
      </h5>
    </b-container>

    <template v-if="loading">
      <EkCarouselPlaceholder />
    </template>

    <template v-else>
      <b-container class="mb-2 mt-2">
        <EkButtonsBar
          class="mr-3 mt-1"
          :title="$tr('moreTopics')"
          :buttons="Array.from(getSearchTerms().keys())"
          @click="goToTerm"
        />
      </b-container>
      <EkCarousel class="pt-3" :nodes="carouselNodes" :showChannelIcon="true" />
    </template>

    <div class="flex-fill main">

      <template v-if="loading">
        <EkCardGridPlaceholder />
      </template>
      <template v-else>
        <EkIguanaList />
      </template>

    </div>

    <AboutFooter class="pt-3" />

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames, getSearchTerms } from '../constants';

  import EkIguanaList from '../components/EkIguanaList';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutFooter from '../components/AboutFooter';

  export default {
    name: 'DiscoveryPageEkIguana',
    components: { EkIguanaList, DiscoveryNavBar, AboutFooter },
    mixins: [commonCoreStrings],
    props: {},
    computed: {
      ...mapState('topicsRoot', { carouselNodes: 'carouselNodes' }),
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
    methods: {
      goToTerm(term) {
        const query = getSearchTerms().get(term) || term;
        this.$router.push({
          name: PageNames.SEARCH,
          params: { query },
        });
      },
    },
    $trs: {
      contentSuggestionsHeading: {
        message: 'Content Suggestions',
        context: 'Heading for a set of suggestions for content',
      },
      moreTopics: {
        message: 'More Topics',
        context: 'Heading for a section listing more topics',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main {
    background-color: $white;
  }

  .discovery-navbar {
    background: $gray-300;
    border-bottom: 1px solid $gray-400;
  }

  .channels-page {
    padding-top: $navbar-height;
  }

</style>
