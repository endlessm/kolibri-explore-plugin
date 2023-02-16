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

      <template v-if="isDownloading">
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
    props: {},
    data() {
      return {
        status: null,
        updateIntervalId: null,
        // FIXME: Read the starter pack from plugin options.
        packName: 'Explorer',
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
      titleLabel() {
        if (this.isDownloading) {
          return this.$tr('titleDownloading', {
            packName: this.packName,
          });
        }
        return this.$tr('titleCompleted', {
          packName: this.packName,
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
      updateLoop() {
        return this.updateDownload().then(status => {
          this.status = status;
          if (this.isCompleted) {
            this.clearUpdateInterval();
          }
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
        return client({
          url: urls['kolibri:kolibri_explore_plugin:update_download'](),
          method: 'POST',
        }).then(({ data }) => {
          return data.status;
        });
      },
    },
    $trs: {
      titleDownloading: 'Downloading {packName} Starter Pack!',
      titleCompleted: '{packName} Starter Pack has been delivered!',
      confirmLabel: 'Show me',
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
