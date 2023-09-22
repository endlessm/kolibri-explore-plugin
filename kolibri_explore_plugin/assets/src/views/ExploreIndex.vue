<template>

  <div>
    <EkBackToTop />
    <ContentModal />
    <AboutModal id="about-modal" />
    <DevTag v-if="showBuildInfo" />
    <keep-alive include="SearchPage">
      <component
        :is="currentPage"
        v-if="currentPage"
        v-bind="currentPageProperties"
        @customPresentationLoadStarted="onCustomPresentationLoadStarted"
        @customPresentationLoadCompleted="onCustomPresentationLoadCompleted"
      />
    </keep-alive>
    <b-overlay :show="isCustomPresentationLoading" noWrap>
      <template #overlay>
        <img :src="loadingImg">
      </template>
    </b-overlay>
    <router-view />
    <SideNav
      v-if="enableSideNav"
      ref="sideNav"
      class="side-nav"
      :navShown="showSideNav"
      @toggleSideNav="toggleSideNav()"
      @shouldFocusFirstEl="findFirstEl()"
    />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import LoadingImage from 'ek-components/src/assets/loading-animation.gif';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import SideNav from 'kolibri.coreVue.components.SideNav';
  import plugin_data from 'plugin_data';
  import { PageNames } from '../constants';
  import AboutModal from '../components/AboutModal';
  import commonExploreStrings from './commonExploreStrings';
  import DiscoveryPage from './DiscoveryPage';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';
  import ContentUnavailablePage from './ContentUnavailablePage';
  import SearchPage from './SearchPage';
  import ContentPage from './ContentPage';
  import WelcomePage from './welcome/WelcomePage';
  import PackSelectionPage from './welcome/PackSelectionPage';
  import PackReadyPage from './welcome/PackReadyPage';
  import DownloadPage from './DownloadPage';
  import DevTag from './DevTag';
  import ContentModal from './ContentModal';

  const pageNameToComponentMap = {
    [PageNames.TOPICS_ROOT]: DiscoveryPage,
    [PageNames.TOPICS_CHANNEL]: CustomChannelPresentationApp,
    [PageNames.TOPICS_TOPIC]: CustomChannelPresentationApp,
    [PageNames.CONTENT_UNAVAILABLE]: ContentUnavailablePage,
    [PageNames.SEARCH]: SearchPage,
    [PageNames.CONTENT]: ContentPage,
    [PageNames.WELCOME_ROOT]: WelcomePage,
    [PageNames.WELCOME_PACK_SELECTION]: PackSelectionPage,
    [PageNames.WELCOME_PACK_READY]: PackReadyPage,
    [PageNames.DOWNLOAD]: DownloadPage,
  };

  export default {
    name: 'ExploreIndex',
    components: {
      AboutModal,
      ContentModal,
      DevTag,
      SideNav,
    },
    mixins: [commonCoreStrings, commonExploreStrings, responsiveWindowMixin],
    data() {
      return {
        lastRoute: null,
        isCustomPresentationLoading: false,
      };
    },
    computed: {
      ...mapState(['pageName']),
      ...mapState('topicsRoot', { showSideNav: 'showSideNav' }),
      currentPage() {
        return pageNameToComponentMap[this.pageName] || null;
      },
      currentPageProperties() {
        return {};
      },
      showBuildInfo() {
        return window.showBuildInfo;
      },
      loadingImg() {
        return LoadingImage;
      },
      enableSideNav() {
        return plugin_data.enableSideNav;
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
      onCustomPresentationLoadStarted() {
        this.isCustomPresentationLoading = true;
      },
      onCustomPresentationLoadCompleted() {
        this.isCustomPresentationLoading = false;
      },
      toggleSideNav() {
        this.$store.commit('topicsRoot/SET_SHOW_SIDE_NAV', !this.showSideNav);
      },
      findFirstEl() {
        this.$nextTick(() => {
          this.$refs.sideNav.focusFirstEl();
        });
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


<style lang="scss" scoped>

  ::v-deep .side-nav .bottom-bar {
    display: none !important;
  }

  ::v-deep .side-nav .modal {
    display: initial;
  }

</style>
