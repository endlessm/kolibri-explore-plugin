<template>

  <b-modal
    id="install-content-modal"
    size="xl"
    centered
    :visible="true"
    :noCloseOnBackdrop="true"
    :noCloseOnEsc="true"
    :hideFooter="true"
    :hideHeaderClose="true"
  >
    <b-container>
      <h1>
        {{ titleLabel }}
      </h1>

      <template v-if="gotDownloadError">
        <p>{{ errorMessage }}</p>
        <b-button variant="primary" @click="onRetry">
          {{ $tr('retryLabel') }}
        </b-button>
      </template>
      <template v-else-if="isDownloading">
        <b-progress v-if="status !== null" :max="1">
          <b-progress-bar
            :value="status.progress"
            animated
          >
            {{ (status.progress * 100).toFixed() }}%
          </b-progress-bar>
        </b-progress>
      </template>
      <template v-else>
        <b-button variant="primary" @click="onConfirm">
          {{ $tr('confirmLabel') }}
        </b-button>
      </template>

    </b-container>
  </b-modal>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';
  import { mapState } from 'vuex';

  const UPDATE_DELAY = 1500;

  export default {
    name: 'InstallContentModal',
    components: {},
    emits: ['downloadConfirmed'],
    props: {
      packTitle: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
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
      return this.setUpdateInterval();
    },
    beforeDestroy() {
      this.clearUpdateInterval();
    },
    methods: {
      onConfirm() {
        this.$emit('downloadConfirmed');
      },
      onRetry() {
        this.errorMessage = null;
        this.retry = true;
        return this.setUpdateInterval();
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
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  ::v-deep .modal-content {
    color: black;
    text-align: center;
    background-color: white;
  }

</style>
