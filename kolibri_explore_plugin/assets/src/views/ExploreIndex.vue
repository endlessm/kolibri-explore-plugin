<template>

  <div>
    <ContentModal />
    <DevTag v-if="showBuildInfo" />
    <component
      :is="currentPage"
      v-if="currentPage"
      @loading="onLoading"
      @load="onLoad"
    />
    <b-overlay :show="isLoading" noWrap>
      <template #overlay>
        <img :src="loadingImg">
      </template>
    </b-overlay>
    <router-view />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import LoadingImage from 'eos-components/src/assets/loading-animation.gif';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import { PageNames } from '../constants';
  import commonExploreStrings from './commonExploreStrings';
  import ChannelsPage from './ChannelsPage';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';
  import ContentUnavailablePage from './ContentUnavailablePage';
  import SearchPage from './SearchPage';
  import DevTag from './DevTag';
  import ContentModal from './ContentModal';

  const pageNameToComponentMap = {
    [PageNames.TOPICS_ROOT]: ChannelsPage,
    [PageNames.TOPICS_CHANNEL]: CustomChannelPresentationApp,
    [PageNames.TOPICS_TOPIC]: CustomChannelPresentationApp,
    [PageNames.CONTENT_UNAVAILABLE]: ContentUnavailablePage,
    [PageNames.SEARCH]: SearchPage,
  };

  export default {
    name: 'ExploreIndex',
    components: { ContentModal, DevTag },
    mixins: [commonCoreStrings, commonExploreStrings, responsiveWindowMixin],
    data() {
      return {
        lastRoute: null,
        isLoading: false,
      };
    },
    computed: {
      ...mapState(['pageName']),
      currentPage() {
        return pageNameToComponentMap[this.pageName] || null;
      },
      showBuildInfo() {
        return window.showBuildInfo;
      },
      loadingImg() {
        return LoadingImage;
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
    methods: {
      onLoading() {
        this.isLoading = true;
      },
      onLoad() {
        this.isLoading = false;
      },
    },
  };

</script>


<style lang="scss">

  @import '../index';

  .partial-fonts-loaded body,
  .partial-fonts-loaded input,
  .partial-fonts-loaded select,
  .partial-fonts-loaded textarea,
  .full-fonts-loaded body,
  .full-fonts-loaded input,
  .full-fonts-loaded select,
  .full-fonts-loaded textarea {
    font-family: $font-family-sans-serif;
  }

  .partial-fonts-loaded button,
  .full-fonts-loaded button {
    font-family: $headings-font-family;
  }

  /** Non scoped styles to be able to modify body css to fix the footer to the bottom **/
  html {
    height: 100%;
  }

  body,
  body > div {
    height: 100vh;
    min-height: 100vh;
  }

  // Remove the padding added by the modal
  // https://stackoverflow.com/questions/32862394/bootstrap-modals-keep-adding-padding-right-to-body-after-closed
  body.modal-open {
    padding-right: 0 !important;
  }

</style>
