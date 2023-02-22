<template>

  <div>
    <BackToTop />
    <div>
      <InstallContentModal
        v-if="installModalVisible"
        :packTitle="packTitle"
        @downloadConfirmed="onDownloadCompleted"
      />
    </div>
    <ContentModal />
    <AboutModal id="about-modal" />
    <DevTag v-if="showBuildInfo" />
    <keep-alive include="SearchPage">
      <component
        :is="currentPage"
        v-if="currentPage"
        v-bind="currentPageProperties"
        @loading="onLoading"
        @load="onLoad"
      />
    </keep-alive>
    <b-overlay :show="isLoading" noWrap>
      <template #overlay>
        <img :src="loadingImg">
      </template>
    </b-overlay>
    <router-view />
  </div>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';
  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import LoadingImage from 'eos-components/src/assets/loading-animation.gif';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import { ChannelResource, ContentNodeResource } from 'kolibri.resources';
  import plugin_data from 'plugin_data';
  import { showChannels } from '../modules/topicsRoot/handlers';
  import { PageNames } from '../constants';
  import AboutModal from '../components/AboutModal';
  import InstallContentModal from '../components/InstallContentModal';
  import commonExploreStrings from './commonExploreStrings';
  import DiscoveryPage from './DiscoveryPage';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';
  import ContentUnavailablePage from './ContentUnavailablePage';
  import SearchPage from './SearchPage';
  import ContentPage from './ContentPage';
  import DevTag from './DevTag';
  import ContentModal from './ContentModal';

  const pageNameToComponentMap = {
    [PageNames.TOPICS_ROOT]: DiscoveryPage,
    [PageNames.TOPICS_CHANNEL]: CustomChannelPresentationApp,
    [PageNames.TOPICS_TOPIC]: CustomChannelPresentationApp,
    [PageNames.CONTENT_UNAVAILABLE]: ContentUnavailablePage,
    [PageNames.SEARCH]: SearchPage,
    [PageNames.CONTENT]: ContentPage,
  };

  export default {
    name: 'ExploreIndex',
    components: {
      AboutModal,
      ContentModal,
      DevTag,
      InstallContentModal,
    },
    mixins: [commonCoreStrings, commonExploreStrings, responsiveWindowMixin],
    data() {
      return {
        lastRoute: null,
        isLoading: false,
        // Collections selection and download data:
        loadingCollections: true,
        collectionsInfo: null,
        grade: null,
        name: null,
        downloadInitiated: false,
        downloadCompleted: false,
        // Use this flag to debug the download selection:
        debugForceDownloadSelection: false,
      };
    },
    computed: {
      ...mapState(['pageName']),
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      ...mapState({
        coreLoading: state => state.core.loading,
      }),
      packTitle() {
        if (!this.collectionsInfo || !this.grade || !this.name) {
          return '';
        }
        const pack = this.collectionsInfo.find(c => c.grade === this.grade);
        return pack['collections'].find(p => p.name === this.name).metadata.title;
      },
      currentPage() {
        return pageNameToComponentMap[this.pageName] || null;
      },
      currentPageProperties() {
        if (this.pageName === PageNames.TOPICS_ROOT) {
          return { downloading: this.downloadInitiated && !this.downloadCompleted };
        }
        return {};
      },
      showBuildInfo() {
        return window.showBuildInfo;
      },
      loadingImg() {
        return LoadingImage;
      },
      installModalVisible() {
        if (this.coreLoading || this.loadingCollections || this.downloadCompleted) {
          return false;
        }
        return this.downloadInitiated;
      },
    },
    watch: {
      coreLoading() {
        if (this.coreLoading || this.collectionsInfo !== null) {
          return;
        }
        if (this.debugForceDownloadSelection) {
          return this.cancelDownload().then(() => {
            this.setupCollections();
          });
        }
        return this.setupCollections();
      },
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
      setupCollections() {
        // If a download is ongoing then display the progress.
        // If a download can be resumed then resume it and display the progress.
        // Otherwise check if the conditions are met to display the collection selection.
        // Current conditions are: there is no content or a debugging flag is enabled.
        this.loadingCollections = true;
        return Promise.all([
          this.getCollectionsInfo(),
          this.getDownloadStatus(),
          this.getShouldResume(),
        ])
          .then(([collectionsInfo, status, { shouldResume, grade, name }]) => {
            this.collectionsInfo = collectionsInfo;
            if (status.stage === 'COMPLETED') {
              console.debug('Download completed.');
              this.downloadCompleted = true;
            } else if (status.stage !== 'NOT_STARTED') {
              console.debug('A collections download is ongoing...');
              this.downloadInitiated = true;
            } else {
              if (shouldResume) {
                console.debug('Resuming previous collections download...');
                return this.resumeDownload().then(() => {
                  this.downloadInitiated = true;
                  this.grade = grade;
                  this.name = name;
                });
              } else {
                // Check conditions to prevent starting the download:
                // - using EK Iguana page, or:
                // - there is downloaded content already (can be forced True with a debug setting)
                const hasContent = this.rootNodes.length > 0;
                this.downloadCompleted =
                  plugin_data.useEkIguanaPage || (hasContent && !this.debugForceDownloadSelection);
                if (this.downloadCompleted) {
                  console.debug('Conditions not met to download, assuming as completed.');
                } else {
                  this.onGradeSelected(plugin_data.initialContentPack);
                  this.onNameSelected('0001');
                  console.debug('Downloading starter pack.');
                }
              }
            }
          })
          .then(() => {
            this.loadingCollections = false;
          });
      },
      getCollectionsInfo() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_collections_info'](),
        }).then(({ data }) => {
          return data.collectionsInfo;
        });
      },
      getDownloadStatus() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        }).then(({ data }) => {
          return data.status;
        });
      },
      getShouldResume() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_should_resume'](),
        }).then(({ data }) => {
          return data;
        });
      },
      resumeDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:resume_download'](),
          method: 'POST',
        }).then(({ data }) => {
          return data.status;
        });
      },
      startDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:start_download'](),
          method: 'POST',
          data: { grade: this.grade, name: this.name },
        }).then(({ data }) => {
          return data.status;
        });
      },
      cancelDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:cancel_download'](),
          method: 'DELETE',
        }).then(({ data }) => {
          return data.status;
        });
      },
      onGradeSelected(grade) {
        this.grade = grade;
      },
      onNameSelected(name) {
        this.name = name;
        this.startDownload().then(() => {
          this.downloadInitiated = true;
        });
      },
      onDownloadCompleted() {
        this.downloadCompleted = true;
        ContentNodeResource.useContentCacheKey = false;
        ContentNodeResource.clearCache();
        ChannelResource.useContentCacheKey = false;
        ChannelResource.clearCache();
        return showChannels(this.$store).then(() => location.reload());
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
