<template>

  <div
    class="d-flex main-container min-vh-100 text-center"
  >
    <b-container
      class="d-flex flex-column flex-grow-1 no-container-padding welcome-container"
    >
      <b-container
        class="d-flex flex-column flex-grow-1 justify-content-center no-container-padding"
      >
        <h1 class="mb-3">
          {{ titleLabel }}
        </h1>
        <div
          class="pack-background"
          :style="{ backgroundImage: packBackgroundUrl }"
        >
        </div>

        <b-row class="justify-content-center mt-4">
          <b-col cols="12" sm="8">
            <b-progress
              :max="1"
              :value="displayProgress"
              variant="endless-orange"
              animated
            />
            <p class="mt-1">
              {{ (displayProgress * 100).toFixed() }}%
            </p>
            <template v-if="gotDownloadError">
              <p>{{ errorMessage }}</p>
              <b-button pill variant="primary" @click="onRetry">
                {{ $tr('retryLabel') }}
              </b-button>
            </template>
            <template v-else-if="isCompleted">
              <b-button pill variant="primary" @click="onConfirm">
                {{ $tr('confirmLabel') }}
              </b-button>
            </template>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';
  import { mapState } from 'vuex';
  import { getCollectionInfo } from '../modules/coreExplore/utils';

  const UPDATE_DELAY = 1500;

  export default {
    name: 'DownloadPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: {},
    props: {},
    data() {
      return {
        packTitle: null,
        status: null,
        errorMessage: null,
        updateIntervalId: null,
        retry: false,
      };
    },
    computed: {
      ...mapState({
        pageVisible: state => state.core.pageVisible,
      }),
      isCompleted() {
        return this.status && this.status.stage === 'COMPLETED';
      },
      isDownloading() {
        return !this.isCompleted;
      },
      gotDownloadError() {
        return this.errorMessage != null;
      },
      titleLabel() {
        if (this.isDownloading) {
          return this.$tr('titleDownloading', {
            packTitle: this.packTitle,
          });
        }
        return this.$tr('titleCompleted', {
          packTitle: this.packTitle,
        });
      },
      displayProgress() {
        if (this.status === null) {
          return 0;
        }
        return this.status.progress;
      },
      packBackgroundUrl() {
        const assetName = this.isDownloading ? 'pack-downloading' : 'pack-ready';
        const assetUrl = urls.static(`download/${assetName}.png`);
        return `url('${assetUrl}')`;
      },
    },
    watch: {
      pageVisible() {
        if (!this.pageVisible && this.updateIntervalId !== null) {
          console.debug('Download: Update poll paused.');
          clearInterval(this.updateIntervalId);
          this.updateIntervalId = null;
        } else if (this.pageVisible && this.updateIntervalId === null) {
          console.debug('Download: Update poll resumed.');
          return this.setUpdateInterval();
        }
      },
    },
    mounted() {
      return getCollectionInfo(this.$route.params.name, this.$route.params.sequence).then(
        collectionsInfo => {
          this.packTitle = collectionsInfo.title;
          return this.setUpdateInterval();
        }
      );
    },
    beforeDestroy() {
      this.clearUpdateInterval();
    },
    methods: {
      onRetry() {
        this.errorMessage = null;
        this.retry = true;
        return this.setUpdateInterval();
      },
      onConfirm() {
        // Reload the page so the app fetches new data from the backend. Upon
        // reloading, it will redirect to the landing page.
        // <https://github.com/endlessm/kolibri-explore-plugin/issues/687>
        window.location.reload();
      },
      updateLoop() {
        return this.updateDownload()
          .then(status => {
            this.status = status;
            if (this.isCompleted) {
              this.clearUpdateInterval();
            }
          })
          .catch(error => {
            this.errorMessage = error.response.data.detail;
            this.clearUpdateInterval();
          });
      },
      setUpdateInterval() {
        return this.getDownloadStatus().then(status => {
          this.status = status;
          if (this.isCompleted) {
            return;
          }
          if (this.status.stage !== 'NOT_STARTED') {
            this.updateIntervalId = setInterval(this.updateLoop, UPDATE_DELAY);
          }
        });
      },
      clearUpdateInterval() {
        if (this.updateIntervalId !== null) {
          clearInterval(this.updateIntervalId);
          this.updateIntervalId = null;
        }
      },
      getDownloadStatus() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        }).then(({ data }) => {
          return data.status;
        });
      },
      updateDownload() {
        const data = this.retry ? { retry: true } : {};
        if (this.retry) {
          this.retry = false;
        }
        return client({
          url: urls['kolibri:kolibri_explore_plugin:update_download'](),
          method: 'POST',
          data,
        }).then(({ data }) => {
          return data.status;
        });
      },
    },
    $trs: {
      titleDownloading: 'Downloading {packTitle} Starter Pack!',
      titleCompleted: '{packTitle} Starter Pack has been delivered!',
      confirmLabel: 'Show me',
      retryLabel: 'Retry',
      documentTitle: 'Downloading',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main-container {
    background-color: white;
  }

  .welcome-container {
    padding-top: $spacer;
    padding-bottom: $spacer;

    @include media-breakpoint-down(xs) {
      padding-right: $spacer;
      padding-left: $spacer;
    }
  }

  .pack-background {
    height: 170px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    @include media-breakpoint-down(sm) {
      height: 120px;
    }
  }

</style>
